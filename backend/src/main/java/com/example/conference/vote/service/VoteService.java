package com.example.conference.vote.service;

import com.example.conference.attendance.repository.AttendanceRepository;
import com.example.conference.state.entity.ConferenceState;
import com.example.conference.state.repository.StateRepository;
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
    private static final Long CURRENT_STATE_ID = 1L;

    private final AttendanceRepository attendanceRepository;
    private final VoteRepository voteRepository;
    private final StateRepository stateRepository;

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

    public VoteResponseDTO cast(Long userId, VoteRequestDTO dto) {
        if (userId == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
        if (dto.getVoteValue() == null) {
            throw new IllegalArgumentException("voteValue is required");
        }

        var state = stateRepository.findByStateId(CURRENT_STATE_ID)
                .orElseThrow(() -> new IllegalStateException("conference state not found"));

        if (state.getCurrentState() != ConferenceState.VOTING || state.getCurrentAgendaId() == null) {
            throw new IllegalStateException("Voting is not in progress");
        }

        var attendance = attendanceRepository
                .findByUserIdAndAgendaIdForUpdate(userId, state.getCurrentAgendaId())
                .orElseThrow(() -> new IllegalArgumentException("No voting right for current agenda"));

        var vote = voteRepository.findByAttendanceAttendanceId(attendance.getAttendanceId())
                .map(existingVote -> {
                    existingVote.changeVoteValue(dto.getVoteValue());
                    return existingVote;
                })
                .orElseGet(() -> voteRepository.save(
                        Vote.builder()
                                .attendance(attendance)
                                .voteValue(dto.getVoteValue())
                                .build()
                ));

        return VoteResponseDTO.builder()
                .voteId(vote.getVoteId())
                .voteValue(vote.getVoteValue())
                .attendanceId(attendance.getAttendanceId())
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
