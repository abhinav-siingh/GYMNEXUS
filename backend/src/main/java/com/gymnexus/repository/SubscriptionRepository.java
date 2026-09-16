package com.gymnexus.repository;

import com.gymnexus.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findTopByMemberIdOrderByEndDateDesc(Long memberId);
}
