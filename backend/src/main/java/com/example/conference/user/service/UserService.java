package com.example.conference.user.service;

import com.example.conference.dept.entity.Dept;
import com.example.conference.dept.repository.DeptRepository;
import com.example.conference.security.jwt.JwtTokenProvider;
import com.example.conference.user.dto.*;
import com.example.conference.user.entity.Users;
import com.example.conference.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final DeptRepository deptRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AttendanceCountSseService attendanceCountSseService;
    private final AttendanceSseService attendanceSseService;

    public UserResponseDTO save(UserRequestDTO dto) {
        Dept dept = deptRepository.findById(dto.getDeptId())
                .orElseThrow(() -> new RuntimeException("dept not found"));

        Users user = Users.builder()
                .userName(dto.getUserName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .dept(dept)
                .userPos(dto.getUserPos())
                .isEmergency(dto.isEmergency())
                .build();

        Users saved = userRepository.save(user);
        return UserResponseDTO.from(saved);
    }

    public UserResponseDTO findById(Long id) {
        Users user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("user not found"));
        return UserResponseDTO.from(user);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::from)
                .toList();
    }

    public void delete(Long userId) {
        userRepository.deleteById(userId);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Users user = userRepository
                .findByDeptDeptNameAndUserName(
                        dto.getDeptName(),
                        dto.getUserName()
                )
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.createToken(
                user.getUserId(), user.getUserName()
        );

        return LoginResponseDTO.from(user, token);

    }


    public void changePassword(Long userId, ChangePasswordRequestDto dto) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("user not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("invalid password");
        }

        user.changePassword(passwordEncoder.encode(dto.getNewPassword()));

    }

    public UserResponseDTO toggleAttendance(Long userId){
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("user not found"));
        user.setAttend(!user.isAttend());

        UserResponseDTO response = UserResponseDTO.from(user);
        attendanceSseService.send(response);
        attendanceCountSseService.send(countUsers());
        return response;
    }


    public UserCountDTO countUsers(){
        long totalCount = userRepository.count();
        long attendanceCount=userRepository.countByIsAttendTrue();
        return new UserCountDTO(totalCount,attendanceCount);

    }

}
