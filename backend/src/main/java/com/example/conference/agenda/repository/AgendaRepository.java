package com.example.conference.agenda.repository;

import com.example.conference.agenda.entity.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AgendaRepository extends JpaRepository<Agenda,Long> {

    @Modifying
    @Query("UPDATE Agenda a SET a.agendaState=false WHERE a.agendaId= :id")
    void closeById(Long id);



}
