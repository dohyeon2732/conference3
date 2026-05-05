package com.example.conference.state.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class State {
    @Id
    private Long stateId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConferenceState currentState;

    private Long currentAgendaId;

    public static State createDefault(Long stateId) {
        return State.builder()
                .stateId(stateId)
                .currentState(ConferenceState.PROGRESS)
                .build();
    }

    public void change(ConferenceState currentState, Long agendaId) {
        this.currentState = currentState;

        if(currentState==ConferenceState.VOTING||currentState==ConferenceState.RESULT){
            this.currentAgendaId=agendaId;

        }else {
            this.currentAgendaId=null;
        }
    }
}
