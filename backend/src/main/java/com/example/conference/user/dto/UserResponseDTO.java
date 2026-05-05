package com.example.conference.user.dto;

import com.example.conference.user.entity.Users;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDTO {
    private Long userId;
    private String userName;
    private String userPos;
    private String password;
    private boolean isEmergency;
    private boolean isAttend;
    private Long deptId;
    private String deptName;

    public static UserResponseDTO from (Users user){
        return UserResponseDTO.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userPos(user.getUserPos())
                .isEmergency(user.isEmergency())
                .isAttend(user.isAttend())
                .deptId(user.getDept().getDeptId())
                .deptName(user.getDept().getDeptName())
                .build();
    }

}
