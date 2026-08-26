package com.studyecart.mocktest.dto;

public record TestSummaryResponse(
        Long id, String title, Long subjectId, String subjectName,
        String subjectColor, Integer questionCount, Integer durationMin,
        String difficulty, String description) {}
