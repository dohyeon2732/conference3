package com.example.conference.attendance.repository;

import com.example.conference.attendance.entity.Attendance;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
    Optional<Attendance> findByUserUserIdAndAgendaAgendaId(Long userId, Long agendaId);

    List<Attendance> findByAgendaAgendaId(Long agendaId);

    boolean existsByUserUserIdAndAgendaAgendaId(Long userId, Long agendaId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select a from Attendance a
            where a.user.userId = :userId
            and a.agenda.agendaId = :agendaId
            """)
    Optional<Attendance> findByUserIdAndAgendaIdForUpdate(
            @Param("userId") Long userId,
            @Param("agendaId") Long agendaId
    );

}
