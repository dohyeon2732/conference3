package com.example.conference.dept.repository;

import com.example.conference.dept.entity.Dept;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeptRepository extends JpaRepository<Dept,Long> {
}
