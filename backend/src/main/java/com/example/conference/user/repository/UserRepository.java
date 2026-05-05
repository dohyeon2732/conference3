package com.example.conference.user.repository;

import com.example.conference.dept.entity.Dept;
import com.example.conference.user.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByDeptDeptNameAndUserName(String kukName, String userName);
    List<Users> findByDeptDeptId(Long deptId);
    long countByIsAttendTrue();
}
