package com.example.conference.attendance.service;

import com.example.conference.agenda.repository.AgendaRepository;
import com.example.conference.attendance.dto.AttendanceRequestDTO;
import com.example.conference.attendance.dto.AttendanceResponseDTO;
import com.example.conference.attendance.dto.AttendanceResultResponseDTO;
import com.example.conference.attendance.entity.Attendance;
import com.example.conference.attendance.repository.AttendanceRepository;
import com.example.conference.user.repository.UserRepository;
import com.example.conference.vote.entity.Vote;
import com.example.conference.vote.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final AgendaRepository agendaRepository;
    private final VoteRepository voteRepository;

    public AttendanceResponseDTO save(AttendanceRequestDTO dto) {
        var agenda = agendaRepository.findById(dto.getAgendaId()).orElseThrow(() -> new IllegalArgumentException("agenda not found"));

        var users = userRepository.findAll();

        for (var user : users) {
            if (user.isEmergency()||!(user.isAttend())) continue;
            var attendance = Attendance.builder()
                    .user(user)
                    .agenda(agenda)
                    .build();
            attendanceRepository.save(attendance);
        }

        return AttendanceResponseDTO.builder()
                .agendaId(agenda.getAgendaId())
                .build();
    }

    public AttendanceResponseDTO findById (Long id){
        var attendance = attendanceRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("attendance not found"));

        return AttendanceResponseDTO.builder()
                .agendaId(attendance.getAgenda().getAgendaId())
                .attendanceId(attendance.getAttendanceId())
                .build();
    }

    public List<AttendanceResponseDTO> findAll (){
        return attendanceRepository.findAll()
                .stream()
                .map(AttendanceResponseDTO::from)
                .toList();
    }

    public void delete(Long attendanceId){
        attendanceRepository.deleteById(attendanceId);
    }

    public List<AttendanceResultResponseDTO> findByAgendaId(Long agendaId){
        return attendanceRepository.findByAgendaAgendaId(agendaId)
                .stream()
                .map(attendance -> {
                    var vote= voteRepository.findByAttendanceAttendanceId(
                            attendance.getAttendanceId()
                    );

                    return AttendanceResultResponseDTO.builder()
                            .attendanceId(attendance.getAttendanceId())
                            .agendaId(attendance.getAgenda().getAgendaId())
                            .userId(attendance.getUser().getUserId())
                            .voteValue(vote.map(Vote::getVoteValue).orElse(null))
                            .build();
                })
                .toList();
    }

    public AttendanceResultResponseDTO findByAgendaIdUserId(Long agendaId, Long userId){

        Attendance attendance = attendanceRepository
                .findByUserUserIdAndAgendaAgendaId(userId,agendaId)
                .orElseThrow(()->new IllegalArgumentException("attendance not found"));

        return AttendanceResultResponseDTO.from(attendance);
    }

}
