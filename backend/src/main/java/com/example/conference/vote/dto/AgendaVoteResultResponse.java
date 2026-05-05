package com.example.conference.vote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AgendaVoteResultResponse {
    private Long agendaId;
    private Integer agreeCount;
    private Integer disagreeCount;
    private Integer abstainCount;
}
