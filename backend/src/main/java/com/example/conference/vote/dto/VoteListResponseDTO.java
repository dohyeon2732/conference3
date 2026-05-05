package com.example.conference.vote.dto;


import com.example.conference.vote.entity.VoteType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VoteListResponseDTO {
    private Long voteId;
    private Long attendanceId;
    private Long agendaId;
    private VoteType voteValue;
}
