package com.example.conference.state.controller;

import com.example.conference.state.dto.StateRequestDTO;
import com.example.conference.state.dto.StateResponseDTO;
import com.example.conference.state.service.StateService;
import com.example.conference.state.service.StateSseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/state")
public class StateController {
    private final StateService stateService;
    private final StateSseService stateSseService;

    @GetMapping
    public StateResponseDTO get(){return stateService.result();}

    @PostMapping
    public StateResponseDTO change(@RequestBody StateRequestDTO dto){
        return stateService.change(dto);
    }

    @PutMapping
    public StateResponseDTO update(@RequestBody StateRequestDTO dto){
        return stateService.change(dto);
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamState(){
        return stateSseService.subscribe();
    }


}
