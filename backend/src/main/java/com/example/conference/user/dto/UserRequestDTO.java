package com.example.conference.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserRequestDTO {
    private String userName;
    private String password;
    private String userPos;
    @JsonProperty("emergency")
    private boolean isEmergency;
    private Long deptId;
}
