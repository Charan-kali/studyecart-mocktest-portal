package com.studyecart.mocktest.controller;

import com.studyecart.mocktest.entity.Role;
import com.studyecart.mocktest.entity.User;
import com.studyecart.mocktest.repository.UserRepository;
import com.studyecart.mocktest.repository.TestAttemptRepository;
import com.studyecart.mocktest.dto.ResultResponse;
import com.studyecart.mocktest.repository.StudentAnswerRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mentors")
public class MentorController {
    private final UserRepository userRepository;
    private final TestAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;

    public MentorController(UserRepository userRepository,
                             TestAttemptRepository attemptRepository,
                             StudentAnswerRepository answerRepository) {
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
    }

    @GetMapping("/students")
    public List<User> students() {
        return userRepository.findByRole(Role.STUDENT);
    }

    @GetMapping("/results")
    public List<ResultResponse> results() {
        return attemptRepository.findAll().stream()
                .filter(a -> a.getStatus().name().equals("SUBMITTED"))
                .sorted(Comparator.comparing(com.studyecart.mocktest.entity.TestAttempt::getSubmittedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(a -> {
                    Map<Long, Integer> answers = answerRepository.findByAttemptId(a.getId()).stream()
                            .collect(Collectors.toMap(x -> x.getQuestion().getId(),
                                    com.studyecart.mocktest.entity.StudentAnswer::getSelectedOptionIndex));
                    return new ResultResponse(a.getId(), a.getStudent().getId(), a.getTest().getId(),
                            a.getTest().getTitle(), a.getTest().getSubject().getName(),
                            a.getScore(), a.getTotal(), a.getPercent(), a.getTimeTakenSec(),
                            a.getSubmittedAt(), a.getAutoSubmitted(), answers);
                }).toList();
    }
}
