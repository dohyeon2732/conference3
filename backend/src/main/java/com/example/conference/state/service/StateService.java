package com.example.conference.state.service;


import com.example.conference.state.dto.StateRequestDTO;
import com.example.conference.state.dto.StateResponseDTO;
import com.example.conference.state.entity.ConferenceState;
import com.example.conference.state.entity.State;
import com.example.conference.state.repository.StateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Transactional
public class StateService {
    private static final Long CURRENT_STATE_ID = 1L;

    private final StateRepository stateRepository;
    private final StateSseService stateSseService;

    public StateResponseDTO change(StateRequestDTO dto){
        if (dto.getCurrentState() == null) {
            throw new IllegalArgumentException("currentState is required");
        }
        if(dto.getCurrentState()== ConferenceState.VOTING && dto.getCurrentAgendaId()==null){
            throw new IllegalArgumentException("agendaID is required when VOTING but empty");
        }

        State state = getCurrentState();

        state.change(dto.getCurrentState(),dto.getCurrentAgendaId());

        StateResponseDTO response = StateResponseDTO.from(state);
        stateSseService.send(response);

        return StateResponseDTO.from(state);
    }

    public StateResponseDTO result(){
        return StateResponseDTO.from(getCurrentState());
    }

    private State getCurrentState() {
        return stateRepository.findById(CURRENT_STATE_ID)
                .orElseGet(() -> stateRepository.save(State.createDefault(CURRENT_STATE_ID)));
    }

}
