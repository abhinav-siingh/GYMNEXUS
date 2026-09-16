package com.gymnexus.service;

import com.gymnexus.dto.TrainerRequest;
import com.gymnexus.entity.Trainer;
import com.gymnexus.exception.ResourceNotFoundException;
import com.gymnexus.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerService {

    private final TrainerRepository trainerRepository;

    public List<Trainer> getAll() {
        return trainerRepository.findAll();
    }

    public Trainer create(TrainerRequest request) {
        Trainer trainer = Trainer.builder()
                .name(request.getName())
                .specialization(request.getSpecialization())
                .contact(request.getContact())
                .build();
        return trainerRepository.save(trainer);
    }

    public void delete(Long id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found");
        }
        trainerRepository.deleteById(id);
    }
}
