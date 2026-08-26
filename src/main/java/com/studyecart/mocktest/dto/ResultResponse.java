package com.studyecart.mocktest.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ResultResponse(Long id, Long studentId, Long testId,
                             String testTitle, String subjectName,
                             Integer score, Integer total, Integer percent,
                             Integer timeTakenSec, LocalDateTime submittedAt,
                             Boolean autoSubmitted, Map<Long, Integer> answers) {}
