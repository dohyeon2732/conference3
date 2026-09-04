package com.example.conference.state.repository;

import com.example.conference.state.entity.State;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface StateRepository extends JpaRepository<State,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<State> findByStateId(Long stateId);
}
