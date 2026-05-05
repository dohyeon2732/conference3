package com.example.conference.vote.repository;

import com.example.conference.vote.entity.Vote;
import com.example.conference.vote.entity.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote,Long> {
    boolean existsByAttendanceAttendanceId(Long attendanceId);
    Optional<Vote> findByAttendanceAttendanceId(Long attendanceId);

    Integer countByAttendance_Agenda_AgendaIdAndVoteValue(
            Long agendaId,
            VoteType voteType
    );

    List<Vote> findByAttendance_Agenda_AgendaId(Long agendaId);
}
