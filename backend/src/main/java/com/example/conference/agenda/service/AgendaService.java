package com.example.conference.agenda.service;

import com.example.conference.agenda.dto.AgendaRequestDTO;
import com.example.conference.agenda.dto.AgendaResponseDTO;
import com.example.conference.agenda.entity.Agenda;
import com.example.conference.agenda.repository.AgendaRepository;
import com.example.conference.attendance.repository.AttendanceRepository;
import com.example.conference.state.dto.StateResponseDTO;
import com.example.conference.state.entity.ConferenceState;
import com.example.conference.state.repository.StateRepository;
import com.example.conference.state.service.StateSseService;
import com.example.conference.user.repository.UserRepository;
import com.example.conference.vote.entity.Vote;
import com.example.conference.vote.entity.VoteType;
import com.example.conference.vote.repository.VoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AgendaService {
    private static final Long CURRENT_STATE_ID = 1L;

    private final UserRepository userRepository;
    private final AgendaRepository agendaRepository;
    private final AttendanceRepository attendanceRepository;
    private final VoteRepository voteRepository;
    private final StateRepository stateRepository;
    private final StateSseService stateSseService;


    public AgendaResponseDTO save(AgendaRequestDTO dto){
        Agenda agenda = Agenda.builder()
                .agendaName(dto.getAgendaName())
                .agendaState(dto.isAgendaState())
                .agendaMinimum(dto.isAgendaMinimum())
                .agendaAgree(0)
                .agendaDisagree(0)
                .agendaAbstain(0)
                .build();

        Agenda saved = agendaRepository.save(agenda);
        return AgendaResponseDTO.from(saved);
    }

    public AgendaResponseDTO findById(Long id){
        Agenda agenda = agendaRepository.findById(id).orElseThrow(()->new RuntimeException("not found"));

        Integer agreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                id,
                VoteType.AGREE
        );
        Integer disagreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                id,
                VoteType.DISAGREE
        );
        Integer abstainCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(
                id,
                VoteType.ABSTAIN
        );

        return AgendaResponseDTO.fromWithVote(agenda,agreeCount,disagreeCount,abstainCount);
    }

    public List<AgendaResponseDTO> findAll(){


        return agendaRepository.findAll().stream()
                .map(agenda->{
                    Integer agreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(agenda.getAgendaId(),VoteType.AGREE);
                    Integer disagreeCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(agenda.getAgendaId(),VoteType.DISAGREE);
                    Integer abstainCount = voteRepository.countByAttendance_Agenda_AgendaIdAndVoteValue(agenda.getAgendaId(),VoteType.ABSTAIN);

                    return AgendaResponseDTO.fromWithVote(agenda,agreeCount,disagreeCount,abstainCount);

                })
                .collect(Collectors.toList());
    }

    public void delete(Long id){agendaRepository.deleteById(id);}

    public void close(Long id){
        var state = stateRepository.findByStateId(CURRENT_STATE_ID)
                .orElseThrow(() -> new IllegalStateException("conference state not found"));

        if (state.getCurrentState() == ConferenceState.VOTING) {
            state.change(ConferenceState.RESULT, id);
        }

        var attendances = attendanceRepository.findByAgendaIdForUpdate(id);

        for (var attendance : attendances) {
            if (voteRepository.existsByAttendanceAttendanceId(attendance.getAttendanceId())) continue;

            voteRepository.save(Vote.builder()
                    .attendance(attendance)
                    .voteValue(VoteType.ABSTAIN)
                    .build());
        }

        agendaRepository.closeById(id);
        stateSseService.send(StateResponseDTO.from(state));
    }

}
