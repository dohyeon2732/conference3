package com.example.conference.attendance.dto;

import com.example.conference.attendance.entity.Attendance;
import com.example.conference.vote.entity.VoteType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AttendanceResultResponseDTO {
    private Long attendanceId;
    private Long agendaId;
    private Long userId;
    private VoteType voteValue;


    public static AttendanceResultResponseDTO from (Attendance attendance){
        return AttendanceResultResponseDTO.builder()
                .attendanceId(attendance.getAttendanceId())
                .agendaId(attendance.getAgenda().getAgendaId())
                .userId(attendance.getUser().getUserId())
                .build();
    }

}
