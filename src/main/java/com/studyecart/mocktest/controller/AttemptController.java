package com.studyecart.mocktest.controller;

import com.studyecart.mocktest.dto.*;
import com.studyecart.mocktest.entity.*;
import com.studyecart.mocktest.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/test-attempts")
public class AttemptController {
    private final TestAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final MockTestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final StudentAnswerRepository answerRepository;

    public AttemptController(TestAttemptRepository attemptRepository,
                             UserRepository userRepository,
                             MockTestRepository testRepository,
                             QuestionRepository questionRepository,
                             StudentAnswerRepository answerRepository) {
        this.attemptRepository = attemptRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    @PostMapping("/start")
    public ResponseEntity<?> start(@RequestParam Long studentId, @RequestParam Long testId) {
        User student = userRepository.findById(studentId).orElse(null);
        MockTest test = testRepository.findById(testId).orElse(null);
        if (student == null || test == null) {
            return ResponseEntity.notFound().build();
        }

        TestAttempt attempt = new TestAttempt();
        attempt.setStudent(student);
        attempt.setTest(test);
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setStatus(AttemptStatus.IN_PROGRESS);
        return ResponseEntity.ok(toAttemptResponse(attemptRepository.save(attempt)));
    }

    @PostMapping("/{attemptId}/answers")
    public ResponseEntity<?> saveAnswers(@PathVariable Long attemptId,
                                         @RequestBody List<AnswerRequest> answers) {
        TestAttempt attempt = attemptRepository.findById(attemptId).orElse(null);
        if (attempt == null) return ResponseEntity.notFound().build();
        if (attempt.getStatus() == AttemptStatus.SUBMITTED) {
            return ResponseEntity.badRequest().body(Map.of("error", "Attempt already submitted"));
        }

        for (AnswerRequest request : answers) {
            Question q = questionRepository.findById(request.questionId()).orElse(null);
            if (q == null || !q.getTest().getId().equals(attempt.getTest().getId())) continue;

            StudentAnswer answer = answerRepository
                    .findByAttemptIdAndQuestionId(attemptId, q.getId())
                    .orElseGet(StudentAnswer::new);
            answer.setAttempt(attempt);
            answer.setQuestion(q);
            answer.setSelectedOptionIndex(request.selectedOptionIndex());
            answerRepository.save(answer);
        }

        return ResponseEntity.ok(Map.of("message", "Answers saved"));
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<?> submit(@PathVariable Long attemptId,
                                    @RequestBody SubmitAttemptRequest request) {
        TestAttempt attempt = attemptRepository.findById(attemptId).orElse(null);
        if (attempt == null) return ResponseEntity.notFound().build();
        if (attempt.getStatus() == AttemptStatus.SUBMITTED) {
            return ResponseEntity.badRequest().body(Map.of("error", "Attempt already submitted"));
        }

        if (request.answers() != null) {
            for (AnswerRequest a : request.answers()) {
                Question q = questionRepository.findById(a.questionId()).orElse(null);
                if (q == null || !q.getTest().getId().equals(attempt.getTest().getId())) continue;
                StudentAnswer saved = answerRepository.findByAttemptIdAndQuestionId(attemptId, q.getId())
                        .orElseGet(StudentAnswer::new);
                saved.setAttempt(attempt);
                saved.setQuestion(q);
                saved.setSelectedOptionIndex(a.selectedOptionIndex());
                answerRepository.save(saved);
            }
        }

        List<Question> questions = questionRepository.findByTestIdOrderByQuestionOrderAsc(attempt.getTest().getId());
        Map<Long, Integer> answerMap = answerRepository.findByAttemptId(attemptId).stream()
                .collect(Collectors.toMap(a -> a.getQuestion().getId(), StudentAnswer::getSelectedOptionIndex));

        int score = 0;
        for (Question q : questions) {
            Integer given = answerMap.get(q.getId());
            if (given != null && given.equals(q.getCorrectOptionIndex())) score++;
        }

        LocalDateTime now = LocalDateTime.now();
        int elapsed = (int) Math.max(0, Duration.between(attempt.getStartedAt(), now).getSeconds());

        attempt.setStatus(AttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(now);
        attempt.setScore(score);
        attempt.setTotal(questions.size());
        attempt.setPercent(questions.isEmpty() ? 0 : Math.round((score * 100f) / questions.size()));
        attempt.setTimeTakenSec(elapsed);
        attempt.setAutoSubmitted(Boolean.TRUE.equals(request.autoSubmitted()));
        attemptRepository.save(attempt);

        return ResponseEntity.ok(toResultResponse(attempt));
    }

    @GetMapping("/{attemptId}/result")
    public ResponseEntity<?> result(@PathVariable Long attemptId) {
        return attemptRepository.findById(attemptId)
                .map(a -> ResponseEntity.ok(toResultResponse(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    private AttemptResponse toAttemptResponse(TestAttempt a) {
        return new AttemptResponse(a.getId(), a.getStudent().getId(), a.getTest().getId(),
                a.getStartedAt(), a.getTest().getDurationMin());
    }

    private ResultResponse toResultResponse(TestAttempt a) {
        Map<Long, Integer> answers = answerRepository.findByAttemptId(a.getId()).stream()
                .collect(Collectors.toMap(x -> x.getQuestion().getId(), StudentAnswer::getSelectedOptionIndex));
        return new ResultResponse(a.getId(), a.getStudent().getId(), a.getTest().getId(),
                a.getTest().getTitle(), a.getTest().getSubject().getName(), a.getScore(), a.getTotal(),
                a.getPercent(), a.getTimeTakenSec(), a.getSubmittedAt(), a.getAutoSubmitted(), answers);
    }
}
