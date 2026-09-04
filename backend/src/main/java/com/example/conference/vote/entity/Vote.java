package com.example.conference.vote.entity;

import com.example.conference.attendance.entity.Attendance;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_vote_attendance",
                        columnNames = {"attendance_id"}
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor

public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voteId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteType voteValue;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id", nullable = false)
    private Attendance attendance;

    public void changeVoteValue(VoteType voteValue){
        this.voteValue=voteValue;
    }
}
