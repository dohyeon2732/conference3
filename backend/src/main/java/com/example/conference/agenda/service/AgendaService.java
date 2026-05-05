package com.example.conference.agenda.service;

import com.example.conference.agenda.dto.AgendaRequestDTO;
import com.example.conference.agenda.dto.AgendaResponseDTO;
import com.example.conference.agenda.entity.Agenda;
import com.example.conference.agenda.repository.AgendaRepository;
import com.example.conference.user.repository.UserRepository;
import com.example.conference.vote.dto.AgendaVoteResultResponse;
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
    private final UserRepository userRepository;
    private final AgendaRepository agendaRepository;
    private final VoteRepository voteRepository;


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
    public void close(Long id){agendaRepository.closeById(id);}

}
