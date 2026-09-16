package com.gymnexus.controller;

import com.gymnexus.dto.SubscriptionResponse;
import com.gymnexus.security.JwtUtil;
import com.gymnexus.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final JwtUtil jwtUtil;

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/me")
    public ResponseEntity<SubscriptionResponse> myPlan(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(subscriptionService.getCurrent(memberId));
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/me/renew")
    public ResponseEntity<SubscriptionResponse> renew(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(subscriptionService.renew(memberId));
    }
}
