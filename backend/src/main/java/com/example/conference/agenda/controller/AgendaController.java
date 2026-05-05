package com.example.conference.agenda.controller;

import com.example.conference.agenda.dto.AgendaRequestDTO;
import com.example.conference.agenda.dto.AgendaResponseDTO;
import com.example.conference.agenda.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/agenda")
public class AgendaController {
    private final AgendaService agendaService;

    @PostMapping
    public AgendaResponseDTO create(@RequestBody AgendaRequestDTO dto ){ return agendaService.save(dto);}

    @GetMapping("/{id}")
    public AgendaResponseDTO findById(@PathVariable Long id){return agendaService.findById(id);}

    @GetMapping
    public List<AgendaResponseDTO> findAll(){return agendaService.findAll();}

    @PutMapping("/close/{id}")
    public void closeById(@PathVariable Long id){agendaService.close(id);}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {agendaService.delete(id);}

}
