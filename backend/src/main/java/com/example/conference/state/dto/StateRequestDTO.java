package com.example.conference.state.dto;

import com.example.conference.state.entity.ConferenceState;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StateRequestDTO {
    private ConferenceState currentState;
    private Long currentAgendaId;
}
