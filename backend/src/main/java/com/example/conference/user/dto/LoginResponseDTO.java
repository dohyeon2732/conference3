package com.example.conference.user.dto;

import com.example.conference.user.entity.Users;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDTO {
    private Long userId;
    private String userName;
    private String userPos;
    private boolean isEmergency;
    private boolean isAttend;
    private Long deptId;
    private String deptName;
    private String accessToken;


    public static LoginResponseDTO from (Users user, String accessToken){
        return LoginResponseDTO.builder()
                .userId(user.getUserId())
                .deptId(user.getDept().getDeptId())
                .deptName(user.getDept().getDeptName())
                .userName(user.getUserName())
                .userPos(user.getUserPos())
                .isEmergency(user.isEmergency())
                .isAttend(user.isAttend())
                .accessToken(accessToken)
                .build();
    }

}
