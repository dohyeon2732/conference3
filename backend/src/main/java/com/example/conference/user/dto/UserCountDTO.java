package com.example.conference.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserCountDTO {
    private long totalCount;
    private long attendanceCount;
}
