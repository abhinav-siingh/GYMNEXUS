package com.gymnexus.service;

import com.gymnexus.dto.MemberResponse;
import com.gymnexus.entity.Role;
import com.gymnexus.entity.Subscription;
import com.gymnexus.entity.Trainer;
import com.gymnexus.entity.User;
import com.gymnexus.exception.ResourceNotFoundException;
import com.gymnexus.repository.SubscriptionRepository;
import com.gymnexus.repository.TrainerRepository;
import com.gymnexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TrainerRepository trainerRepository;

    public MemberResponse getProfile(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        return toResponse(member);
    }

    public List<MemberResponse> getAllMembers() {
        return userRepository.findByRole(Role.MEMBER).stream()
                .map(this::toResponse)
                .toList();
    }

    public void assignTrainer(Long memberId, Long trainerId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));
        member.setAssignedTrainer(trainer);
        userRepository.save(member);
    }

    private MemberResponse toResponse(User member) {
        Optional<Subscription> latest = subscriptionRepository.findTopByMemberIdOrderByEndDateDesc(member.getId());

        String plan = latest.map(s -> capitalize(s.getPlan().name())).orElse("—");
        LocalDate end = latest.map(Subscription::getEndDate).orElse(member.getJoinDate());
        String status = latest.map(s -> SubscriptionStatusHelper.statusFor(s.getEndDate())).orElse("expired");
        long daysLeft = latest.map(s -> SubscriptionStatusHelper.daysLeft(s.getEndDate())).orElse(0L);

        return MemberResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .phone(member.getPhone())
                .plan(plan)
                .joined(member.getJoinDate())
                .end(end)
                .status(status)
                .daysLeft(daysLeft)
                .trainerName(member.getAssignedTrainer() != null ? member.getAssignedTrainer().getName() : null)
                .build();
    }

    private String capitalize(String s) {
        return s.charAt(0) + s.substring(1).toLowerCase();
    }
}
