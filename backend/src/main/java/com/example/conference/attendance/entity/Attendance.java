package com.example.conference.attendance.entity;

import com.example.conference.agenda.entity.Agenda;
import com.example.conference.user.entity.Users;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_attendance_agenda_user",
                        columnNames = {"agenda_id", "user_id"}
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agenda_id", nullable = false)
    private Agenda agenda;

}
