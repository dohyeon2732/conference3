package com.example.conference.vote.controller;

import com.example.conference.vote.dto.AgendaVoteResultResponse;
import com.example.conference.vote.dto.VoteListResponseDTO;
import com.example.conference.vote.dto.VoteRequestDTO;
import com.example.conference.vote.dto.VoteResponseDTO;
import com.example.conference.vote.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/vote")
public class VoteController {
    private final VoteService voteService;

    @PostMapping
    public VoteResponseDTO create(@RequestBody VoteRequestDTO dto){
        return voteService.save(dto);
    }

    @PutMapping
    public VoteResponseDTO vote(@RequestBody VoteRequestDTO dto){
        return voteService.vote(dto);
    }

    @PostMapping("/cast")
    public VoteResponseDTO cast(HttpServletRequest request, @RequestBody VoteRequestDTO dto){
        Long userId = (Long) request.getAttribute("userId");
        return voteService.cast(userId, dto);
    }

    @GetMapping("/result/{agendaId}")
    public AgendaVoteResultResponse getAgendaVoteResult(@PathVariable Long agendaId) {
        return voteService.getAgendaVoteResult(agendaId);
    }

    @GetMapping("/agenda/{agendaId}")
    public List<VoteListResponseDTO> getVoteList(@PathVariable Long agendaId){
        return voteService.getVoteList(agendaId);
    }
}
