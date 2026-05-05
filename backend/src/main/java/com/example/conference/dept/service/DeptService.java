package com.example.conference.dept.service;

import com.example.conference.dept.dto.DeptRequestDTO;
import com.example.conference.dept.dto.DeptResponseDTO;
import com.example.conference.dept.entity.Dept;
import com.example.conference.dept.repository.DeptRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DeptService {
    private final DeptRepository deptRepository;

    public DeptResponseDTO save (DeptRequestDTO dto){
        Dept dept = Dept.builder()
                .deptName(dto.getDeptName())
                .build();

        Dept saved = deptRepository.save(dept);
        return DeptResponseDTO.from(saved);
    }

    public DeptResponseDTO findById (Long id){
        Dept dept = deptRepository.findById(id).orElseThrow(()->new RuntimeException("dept not found"));
        return DeptResponseDTO.from(dept);
    }

    public List<DeptResponseDTO> findAll(){
        return deptRepository.findAll()
                .stream()
                .map(DeptResponseDTO::from)
                .toList();
    };

    public void delete(Long deptId) {deptRepository.deleteById(deptId);}

}
