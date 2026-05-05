package com.example.conference.agenda.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access= AccessLevel.PROTECTED)
@AllArgsConstructor

public class Agenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long agendaId;
    private String agendaName;
    private boolean agendaState;
    private boolean agendaMinimum;

    private Integer agendaAgree;
    private Integer agendaDisagree;
    private Integer agendaAbstain;

}
