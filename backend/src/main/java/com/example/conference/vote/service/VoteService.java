package com.example.conference.vote.service;

import com.example.conference.attendance.repository.AttendanceRepository;
import com.example.conference.vote.dto.AgendaVoteResultResponse;
import com.example.conference.vote.dto.VoteListResponseDTO;
import com.example.conference.vote.dto.VoteRequestDTO;
import com.example.conference.vote.dto.VoteResponseDTO;
import com.example.conference.vote.entity.Vote;
import com.example.conference.vote.entity.VoteType;
import com.example.conference.vote.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VoteService {
    private final AttendanceRepository attendanceRepository;
    private final VoteRepository voteRepository;

    public VoteResponseDTO save(VoteRequestDTO dto){
        var attendance = attendanceRepository.findById(dto.getAttendanceId())
                .orElseThrow(()->new IllegalArgumentException("attendance X"));

        if(voteRepository.existsByAttendanceAttendanceId(dto.getAttendanceId())){
            throw new IllegalArgumentException("이미 개설된 투표");
        }

        var vote = Vote.builder()
                .attendance(attendance)
                .voteValue(dto.getVoteValue())
                .build();

        var saved = voteRepository.save(vote);

        return VoteResponseDTO.builder()
                .voteId(saved.getVoteId())
                .voteValue(saved.getVoteValue())
                .attendanceId(attendance.getAttendanceId())
                .build();
    }

    public VoteResponseDTO vote (VoteRequestDTO dto) {

        var vote = voteRepository.findByAttendanceAttendanceId(dto.getAttendanceId())
                .orElseThrow(() -> new IllegalArgumentException("개설된 투표 없음"));

        vote.changeVoteValue(dto.getVoteValue());

        return VoteResponseDTO.builder()
                .voteId(vote.getVoteId())
                .voteValue(vote.getVoteValue())
                .attendanceId(vote.getAttendance().getAttendanceId())
                .build();

    }

    public AgendaVoteResultResponse getAgendaVoteResult(Long agendaId) {
        Integer agreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                agendaId,
                VoteType.AGREE
        );
        Integer disagreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                agendaId,
                VoteType.DISAGREE
        );
        Integer abstainCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                agendaId,
                VoteType.ABSTAIN
        );

        return new AgendaVoteResultResponse(
                agendaId,
                agreeCount,
                disagreeCount,
                abstainCount
        );
    }

    public List<VoteListResponseDTO> getVoteList(Long agendaId){
        return voteRepository.findByAttendance_Agenda_AgendaId(agendaId)
                .stream()
                .map(vote->VoteListResponseDTO.builder()
                        .voteId(vote.getVoteId())
                        .attendanceId(vote.getAttendance().getAttendanceId())
                        .agendaId(vote.getAttendance().getAgenda().getAgendaId())
                        .voteValue(vote.getVoteValue())
                        .build())
                .toList();
    }
}
