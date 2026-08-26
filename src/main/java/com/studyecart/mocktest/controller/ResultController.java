package com.studyecart.mocktest.controller;

import com.studyecart.mocktest.dto.ResultResponse;
import com.studyecart.mocktest.entity.StudentAnswer;
import com.studyecart.mocktest.entity.TestAttempt;
import com.studyecart.mocktest.repository.StudentAnswerRepository;
import com.studyecart.mocktest.repository.TestAttemptRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/results")
public class ResultController {
    private final TestAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;

    public ResultController(TestAttemptRepository attemptRepository, StudentAnswerRepository answerRepository) {
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return attemptRepository.findById(id)
                .map(a -> ResponseEntity.ok(toResult(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<ResultResponse> studentResults(@PathVariable Long studentId) {
        return attemptRepository.findByStudentIdOrderBySubmittedAtDesc(studentId).stream()
                .filter(a -> a.getStatus().name().equals("SUBMITTED"))
                .map(this::toResult)
                .toList();
    }

    private ResultResponse toResult(TestAttempt a) {
        Map<Long, Integer> answers = answerRepository.findByAttemptId(a.getId()).stream()
                .collect(Collectors.toMap(x -> x.getQuestion().getId(), StudentAnswer::getSelectedOptionIndex));
        return new ResultResponse(a.getId(), a.getStudent().getId(), a.getTest().getId(),
                a.getTest().getTitle(), a.getTest().getSubject().getName(), a.getScore(), a.getTotal(),
                a.getPercent(), a.getTimeTakenSec(), a.getSubmittedAt(), a.getAutoSubmitted(), answers);
    }
}
