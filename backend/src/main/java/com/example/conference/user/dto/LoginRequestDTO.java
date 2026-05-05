package com.example.conference.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequestDTO {
    private String deptName;
    private String userName;
    private String password;
}
