package com.example.conference.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminLoginResponseDTO {
    private String accessToken;
    private String role;
}
