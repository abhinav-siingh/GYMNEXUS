package com.gymnexus.config;

import com.gymnexus.entity.*;
import com.gymnexus.repository.DietTemplateRepository;
import com.gymnexus.repository.TrainerRepository;
import com.gymnexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Map;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = Logger.getLogger(DataSeeder.class.getName());

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final DietTemplateRepository dietTemplateRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedTrainers();
        seedDietTemplates();
    }

    private void seedAdmin() {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            User admin = User.builder()
                    .name("Abhinav Singh")
                    .phone("9999999999")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .joinDate(LocalDate.now())
                    .build();
            userRepository.save(admin);
            log.warning("Seeded default ADMIN — phone: 9999999999 / password: admin123 — CHANGE THIS before going live.");
        }
    }

    private void seedTrainers() {
        if (trainerRepository.count() == 0) {
            trainerRepository.save(Trainer.builder().name("Karan Malhotra").specialization("Strength & Conditioning").contact("karan@gymnexus.in").build());
            trainerRepository.save(Trainer.builder().name("Meera Iyer").specialization("Yoga & Mobility").contact("meera@gymnexus.in").build());
            trainerRepository.save(Trainer.builder().name("Aditya Singh").specialization("Nutrition & Weight Loss").contact("aditya@gymnexus.in").build());
        }
    }

    private void seedDietTemplates() {
        if (dietTemplateRepository.count() == 0) {
            Map<DayOfWeek, String> defaults = Map.of(
                    DayOfWeek.MONDAY, "High-protein day — eggs, grilled chicken/paneer, dal, and a big portion of vegetables. Fuel up for the week.",
                    DayOfWeek.TUESDAY, "Balanced day — mixed vegetables, roti, curd, and a moderate portion of lean protein.",
                    DayOfWeek.WEDNESDAY, "Carb-focused day — brown rice or oats, banana, and nut butter to support mid-week training volume.",
                    DayOfWeek.THURSDAY, "High-protein day — fish/tofu, quinoa or dal, and leafy greens for recovery.",
                    DayOfWeek.FRIDAY, "Light & clean day — soups, salads, sprouts, and lighter portions to close out the week.",
                    DayOfWeek.SATURDAY, "Performance day — complex carbs, chicken/paneer, and healthy fats for your heaviest training day.",
                    DayOfWeek.SUNDAY, "Recovery day — home-cooked meals, extra hydration, and fruit; keep it simple and easy on digestion."
            );
            defaults.forEach((day, details) ->
                    dietTemplateRepository.save(DietTemplate.builder().dayOfWeek(day).details(details).build())
            );
        }
    }
}
