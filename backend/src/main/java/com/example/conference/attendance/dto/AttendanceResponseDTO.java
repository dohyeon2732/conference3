package com.example.conference.attendance.dto;

import com.example.conference.attendance.entity.Attendance;
import com.example.conference.vote.entity.VoteType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendanceResponseDTO {
    private Long attendanceId;
    private Long agendaId;


    public static AttendanceResponseDTO from(Attendance attendance){
        return AttendanceResponseDTO.builder()
                .attendanceId(attendance.getAttendanceId())
                .agendaId(attendance.getAgenda().getAgendaId())
                .build();
    }
}
