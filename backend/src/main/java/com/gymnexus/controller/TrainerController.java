package com.gymnexus.controller;

import com.gymnexus.dto.TrainerRequest;
import com.gymnexus.entity.Trainer;
import com.gymnexus.service.TrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;

    /** Any logged-in user (member or admin) can view the trainer roster. */
    @GetMapping
    public ResponseEntity<List<Trainer>> getAll() {
        return ResponseEntity.ok(trainerService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Trainer> create(@Valid @RequestBody TrainerRequest request) {
        return ResponseEntity.ok(trainerService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
