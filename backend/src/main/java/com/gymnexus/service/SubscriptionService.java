package com.gymnexus.service;

import com.gymnexus.dto.SubscriptionResponse;
import com.gymnexus.entity.Subscription;
import com.gymnexus.entity.User;
import com.gymnexus.exception.ResourceNotFoundException;
import com.gymnexus.repository.SubscriptionRepository;
import com.gymnexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public SubscriptionResponse getCurrent(Long memberId) {
        return toResponse(getCurrentEntity(memberId));
    }

    private Subscription getCurrentEntity(Long memberId) {
        return subscriptionRepository.findTopByMemberIdOrderByEndDateDesc(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("No subscription found for this member"));
    }

    /** Renews from whichever is later: today, or the current end date (so renewing early doesn't lose paid days). */
    public SubscriptionResponse renew(Long memberId) {
        Subscription current = getCurrentEntity(memberId);
        LocalDate base = current.getEndDate().isAfter(LocalDate.now()) ? current.getEndDate() : LocalDate.now();

        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        Subscription renewed = Subscription.builder()
                .member(member)
                .plan(current.getPlan())
                .startDate(LocalDate.now())
                .endDate(base.plusDays(current.getPlan().getDays()))
                .build();
        return toResponse(subscriptionRepository.save(renewed));
    }

    private SubscriptionResponse toResponse(Subscription s) {
        return SubscriptionResponse.builder()
                .id(s.getId())
                .plan(s.getPlan().name())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .build();
    }
}
