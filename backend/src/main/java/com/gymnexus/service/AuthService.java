package com.gymnexus.service;

import com.gymnexus.dto.AuthResponse;
import com.gymnexus.dto.LoginRequest;
import com.gymnexus.dto.SignupRequest;
import com.gymnexus.entity.PlanType;
import com.gymnexus.entity.Role;
import com.gymnexus.entity.Subscription;
import com.gymnexus.entity.User;
import com.gymnexus.exception.DuplicateResourceException;
import com.gymnexus.repository.SubscriptionRepository;
import com.gymnexus.repository.UserRepository;
import com.gymnexus.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("An account with this phone number already exists");
        }

        PlanType plan = parsePlan(request.getPlan());

        User member = User.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.MEMBER)
                .joinDate(LocalDate.now())
                .build();
        member = userRepository.save(member);

        Subscription subscription = Subscription.builder()
                .member(member)
                .plan(plan)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(plan.getDays()))
                .build();
        subscriptionRepository.save(subscription);

        String token = jwtUtil.generateToken(member.getPhone(), member.getRole().name(), member.getId());
        return new AuthResponse(token, member.getRole().name(), member.getId(), member.getName());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new IllegalStateException("User vanished after authentication"));

        String token = jwtUtil.generateToken(user.getPhone(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName());
    }

    private PlanType parsePlan(String raw) {
        try {
            return PlanType.valueOf(raw.trim().toUpperCase());
        } catch (Exception e) {
            return PlanType.QUARTERLY; // sensible default if something unexpected arrives
        }
    }
}
