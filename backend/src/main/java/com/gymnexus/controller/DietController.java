package com.gymnexus.controller;

import com.gymnexus.dto.DietAssignRequest;
import com.gymnexus.dto.DietPlanResponse;
import com.gymnexus.entity.DietTemplate;
import com.gymnexus.security.JwtUtil;
import com.gymnexus.service.DietService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;
    private final JwtUtil jwtUtil;

    /** Every logged-in member gets today's auto plan — no admin action needed. */
    @GetMapping("/today")
    public ResponseEntity<DietTemplate> today() {
        return ResponseEntity.ok(dietService.getTodaysAutoDiet());
    }

    /** The extra plan a trainer/admin gave this member, if any (204 if none yet). */
    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/me/additional")
    public ResponseEntity<DietPlanResponse> myAdditionalPlan(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        Optional<DietPlanResponse> plan = dietService.getAdditionalPlan(memberId);
        return plan.map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }

    /** Admin/trainer assigns an additional plan to a specific member. */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<DietPlanResponse> assign(@Valid @RequestBody DietAssignRequest request) {
        return ResponseEntity.ok(dietService.assign(request));
    }

    /** Admin's history of all assigned additional plans. */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/plans")
    public ResponseEntity<List<DietPlanResponse>> allPlans() {
        return ResponseEntity.ok(dietService.getAllPlans());
    }
}
