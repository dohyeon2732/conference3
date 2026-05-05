package com.example.conference.attendance.controller;

import com.example.conference.attendance.dto.AttendanceRequestDTO;
import com.example.conference.attendance.dto.AttendanceResponseDTO;
import com.example.conference.attendance.dto.AttendanceResultResponseDTO;
import com.example.conference.attendance.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    @PostMapping
    public AttendanceResponseDTO create(@RequestBody AttendanceRequestDTO dto){return attendanceService.save(dto);}

    @GetMapping("/{id}")
    public AttendanceResponseDTO  findById(@PathVariable Long id){return attendanceService.findById(id); }

    @GetMapping
    public List<AttendanceResponseDTO> findAll(){return attendanceService.findAll();}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {attendanceService.delete(id);}

    @GetMapping("/agenda/{agendaId}")
    public List<AttendanceResultResponseDTO> findByAgendaId(@PathVariable Long agendaId){
        return attendanceService.findByAgendaId(agendaId);
    }

    @GetMapping("/agenda/{agendaId}/user/{userId}")
    public AttendanceResultResponseDTO findByAgendaIdUserId(@PathVariable Long agendaId, @PathVariable Long userId){
        return attendanceService.findByAgendaIdUserId(agendaId,userId);
    }
}
