package com.studyecart.mocktest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_answers",
       uniqueConstraints = @UniqueConstraint(columnNames = {"attempt_id", "question_id"}))
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "attempt_id")
    private TestAttempt attempt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    private Integer selectedOptionIndex;

    public StudentAnswer() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TestAttempt getAttempt() { return attempt; }
    public void setAttempt(TestAttempt attempt) { this.attempt = attempt; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public Integer getSelectedOptionIndex() { return selectedOptionIndex; }
    public void setSelectedOptionIndex(Integer selectedOptionIndex) { this.selectedOptionIndex = selectedOptionIndex; }
}
