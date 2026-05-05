package com.example.conference.user.controller;

import com.example.conference.user.dto.*;
import com.example.conference.user.service.AttendanceSseService;
import com.example.conference.user.repository.UserRepository;
import com.example.conference.user.service.AttendanceCountSseService;
import com.example.conference.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final AttendanceCountSseService attendanceCountSseService;
    private final AttendanceSseService attendanceSseService;

    @PostMapping
    public UserResponseDTO create(@RequestBody UserRequestDTO dto){return userService.save(dto);}

    @GetMapping("/id/{id}")
    public UserResponseDTO findById(@PathVariable Long id){return userService.findById(id);}

    @GetMapping
    public List<UserResponseDTO> findAll(){return userService.findAll();}

    @DeleteMapping("/id/{id}")
    public void delete(@PathVariable Long id){userService.delete(id);}


    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return userService.login(dto);
    }

    @GetMapping("/me")
    public UserResponseDTO me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");

        if(userId == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userService.findById(userId);
    }

    @GetMapping("/dept/{deptId}")
    public List<UserResponseDTO> findByDeptId(@PathVariable Long deptId){
        return userRepository.findByDeptDeptId(deptId)
                .stream()
                .map(UserResponseDTO::from)
                .toList();

    }

    @PostMapping("/password")
    public void changePassword(HttpServletRequest request,@RequestBody ChangePasswordRequestDto dto){
        Long userId = (Long) request.getAttribute("userId");
        if(userId ==null)
        {
            throw new RuntimeException("Unauthorized");
        }
        userService.changePassword(userId,dto);
    }

    @PatchMapping("/attendance/{id}")
    public UserResponseDTO toggleAttendance(@PathVariable Long id){
        return userService.toggleAttendance(id);
    }
    
    @GetMapping("/count")
    public UserCountDTO countUsers(){
        return userService.countUsers();
    }

    @GetMapping(value = "/count/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCount(){
        return attendanceCountSseService.subscribe();

    }

    @GetMapping(value = "/attendance/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAttendance(){
        return attendanceSseService.subscribe();
    }

}
