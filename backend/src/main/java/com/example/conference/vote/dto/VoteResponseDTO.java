package com.example.conference.vote.dto;

import com.example.conference.vote.entity.VoteType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VoteResponseDTO {
    private Long voteId;
    private VoteType voteValue;
    private Long attendanceId;
}
