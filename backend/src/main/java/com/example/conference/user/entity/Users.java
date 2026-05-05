package com.example.conference.user.entity;

import com.example.conference.dept.entity.Dept;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userName;
    private String password;
    private String userPos;
    private boolean isEmergency;
    private boolean isAttend;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id")
    private Dept dept;

    public void changePassword(String newPassword){
        this.password = newPassword;
    }

}
