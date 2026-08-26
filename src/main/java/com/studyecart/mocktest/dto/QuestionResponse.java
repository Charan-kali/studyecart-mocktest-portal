package com.studyecart.mocktest.dto;

import java.util.List;

public record QuestionResponse(Long id, String text, List<String> options) {}
