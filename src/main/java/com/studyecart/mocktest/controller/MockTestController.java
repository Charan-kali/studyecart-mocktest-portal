package com.studyecart.mocktest.controller;

import com.studyecart.mocktest.dto.*;
import com.studyecart.mocktest.entity.*;
import com.studyecart.mocktest.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mock-tests")
public class MockTestController {
    private final MockTestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository optionRepository;

    public MockTestController(MockTestRepository testRepository,
                               QuestionRepository questionRepository,
                               QuestionOptionRepository optionRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    @GetMapping
    public List<TestSummaryResponse> all() {
        return testRepository.findByActiveTrueOrderByIdAsc().stream().map(this::summary).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestDetailsResponse> details(@PathVariable Long id) {
        return testRepository.findById(id)
                .map(test -> ResponseEntity.ok(detailsOf(test)))
                .orElse(ResponseEntity.notFound().build());
    }

    private TestSummaryResponse summary(MockTest t) {
        int count = questionRepository.findByTestIdOrderByQuestionOrderAsc(t.getId()).size();
        return new TestSummaryResponse(t.getId(), t.getTitle(), t.getSubject().getId(),
                t.getSubject().getName(), t.getSubject().getColor(), count,
                t.getDurationMin(), t.getDifficulty(), t.getDescription());
    }

    private TestDetailsResponse detailsOf(MockTest t) {
        List<QuestionResponse> questions = questionRepository
                .findByTestIdOrderByQuestionOrderAsc(t.getId()).stream()
                .map(q -> new QuestionResponse(q.getId(), q.getText(),
                        optionRepository.findByQuestionIdOrderByOptionIndexAsc(q.getId())
                                .stream().map(QuestionOption::getOptionText).toList()))
                .toList();

        return new TestDetailsResponse(t.getId(), t.getTitle(), t.getSubject().getId(),
                t.getSubject().getName(), t.getSubject().getColor(), t.getDurationMin(),
                t.getDifficulty(), t.getDescription(), questions);
    }
}
