package com.example.conference.dept.controller;

import com.example.conference.dept.dto.DeptRequestDTO;
import com.example.conference.dept.dto.DeptResponseDTO;
import com.example.conference.dept.service.DeptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dept")
public class DeptController {
    private final DeptService deptService;

    @PostMapping
    public DeptResponseDTO create(@RequestBody DeptRequestDTO dto){return deptService.save(dto);}

    @GetMapping("/{id}")
    public DeptResponseDTO findById (@PathVariable Long id){return deptService.findById(id);}

    @GetMapping
    public List<DeptResponseDTO> findAll(){return deptService.findAll();}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){deptService.delete(id);}
}
