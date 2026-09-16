package com.gymnexus.service;

import com.gymnexus.dto.DietAssignRequest;
import com.gymnexus.dto.DietPlanResponse;
import com.gymnexus.entity.DietPlan;
import com.gymnexus.entity.DietTemplate;
import com.gymnexus.entity.Trainer;
import com.gymnexus.entity.User;
import com.gymnexus.exception.ResourceNotFoundException;
import com.gymnexus.repository.DietPlanRepository;
import com.gymnexus.repository.DietTemplateRepository;
import com.gymnexus.repository.TrainerRepository;
import com.gymnexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DietService {

    private final DietTemplateRepository dietTemplateRepository;
    private final DietPlanRepository dietPlanRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;

    /** Every member gets this automatically — no admin action required. */
    public DietTemplate getTodaysAutoDiet() {
        DayOfWeek today = LocalDate.now().getDayOfWeek();
        return dietTemplateRepository.findByDayOfWeek(today)
                .orElseThrow(() -> new ResourceNotFoundException("No diet template configured for " + today));
    }

    /** The extra plan a trainer/admin gave this member, if any. */
    public Optional<DietPlanResponse> getAdditionalPlan(Long memberId) {
        return dietPlanRepository.findTopByMemberIdOrderByAllocatedDateDesc(memberId).map(this::toResponse);
    }

    public DietPlanResponse assign(DietAssignRequest request) {
        User member = userRepository.findById(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        Trainer trainer = null;
        if (request.getTrainerId() != null) {
            trainer = trainerRepository.findById(request.getTrainerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));
        }

        DietPlan plan = DietPlan.builder()
                .member(member)
                .trainer(trainer)
                .details(request.getDetails())
                .allocatedDate(LocalDate.now())
                .build();
        return toResponse(dietPlanRepository.save(plan));
    }

    /** Admin's full history of assigned additional plans across all members. */
    public List<DietPlanResponse> getAllPlans() {
        return dietPlanRepository.findAll().stream().map(this::toResponse).toList();
    }

    private DietPlanResponse toResponse(DietPlan d) {
        return DietPlanResponse.builder()
                .id(d.getId())
                .memberId(d.getMember().getId())
                .memberName(d.getMember().getName())
                .trainerId(d.getTrainer() != null ? d.getTrainer().getId() : null)
                .trainerName(d.getTrainer() != null ? d.getTrainer().getName() : null)
                .details(d.getDetails())
                .allocatedDate(d.getAllocatedDate())
                .build();
    }
}
