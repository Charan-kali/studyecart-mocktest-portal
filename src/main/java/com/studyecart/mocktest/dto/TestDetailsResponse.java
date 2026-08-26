package com.studyecart.mocktest.dto;

import java.util.List;

public record TestDetailsResponse(
        Long id, String title, Long subjectId, String subjectName,
        String subjectColor, Integer durationMin, String difficulty,
        String description, List<QuestionResponse> questions) {}
