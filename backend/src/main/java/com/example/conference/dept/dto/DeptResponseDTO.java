package com.example.conference.dept.dto;

import com.example.conference.dept.entity.Dept;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeptResponseDTO {
    private Long deptId;
    private String deptName;

    public static DeptResponseDTO from (Dept dept){
        return DeptResponseDTO.builder()
                .deptId(dept.getDeptId())
                .deptName(dept.getDeptName())
                .build();

    }

}
