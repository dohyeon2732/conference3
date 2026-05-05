package com.example.conference.user.service;

import com.example.conference.user.dto.UserCountDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class AttendanceCountSseService {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe(){
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(()->emitters.remove(emitter));
        emitter.onTimeout(()-> emitters.remove(emitter));
        emitter.onError((e)->emitters.remove(emitter));
        return emitter;
    }

    public void send(UserCountDTO count){
        for(SseEmitter emitter:emitters){
            try{
                emitter.send(count);
            }catch(IOException e){
                emitters.remove(emitter);
            }
        }
    }
}
