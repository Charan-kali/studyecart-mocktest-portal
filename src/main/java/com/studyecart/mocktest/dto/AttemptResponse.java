package com.studyecart.mocktest.dto;

import java.time.LocalDateTime;

public record AttemptResponse(Long attemptId, Long studentId, Long testId,
                              LocalDateTime startedAt, Integer durationMin) {}
