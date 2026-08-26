package com.studyecart.mocktest.dto;

import java.util.List;

public record SubmitAttemptRequest(List<AnswerRequest> answers, Boolean autoSubmitted) {}
