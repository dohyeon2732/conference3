package com.example.conference.vote.dto;

import com.example.conference.vote.entity.VoteType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VoteRequestDTO {
    private Long attendanceId;
    private VoteType voteValue;

}
