package com.gymnexus.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class SubscriptionStatusHelper {

    private SubscriptionStatusHelper() {}

    public static String statusFor(LocalDate endDate) {
        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), endDate);
        if (daysLeft < 0) return "expired";
        if (daysLeft <= 7) return "expiring";
        return "active";
    }

    public static long daysLeft(LocalDate endDate) {
        return Math.max(ChronoUnit.DAYS.between(LocalDate.now(), endDate), 0);
    }
}
