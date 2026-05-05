package com.example.conference.agenda.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AgendaRequestDTO {
    private String agendaName;
    private boolean agendaState;
    private boolean agendaMinimum;
}
