package com.gymnexus.controller;

import com.gymnexus.dto.AssignTrainerRequest;
import com.gymnexus.dto.MemberResponse;
import com.gymnexus.security.JwtUtil;
import com.gymnexus.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    /** The logged-in member's own dashboard data. */
    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/me")
    public ResponseEntity<MemberResponse> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(memberService.getProfile(memberId));
    }

    /** Admin's full member list. */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<MemberResponse>> getAllMembers() {
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    /** Admin assigns a trainer to a member. */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/trainer")
    public ResponseEntity<Void> assignTrainer(@PathVariable Long id, @Valid @RequestBody AssignTrainerRequest request) {
        memberService.assignTrainer(id, request.getTrainerId());
        return ResponseEntity.noContent().build();
    }
}
