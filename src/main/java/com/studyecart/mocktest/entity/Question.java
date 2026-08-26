package com.studyecart.mocktest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "test_id")
    private MockTest test;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(nullable = false)
    private Integer correctOptionIndex;

    private Integer questionOrder;

    public Question() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public MockTest getTest() { return test; }
    public void setTest(MockTest test) { this.test = test; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public Integer getCorrectOptionIndex() { return correctOptionIndex; }
    public void setCorrectOptionIndex(Integer correctOptionIndex) { this.correctOptionIndex = correctOptionIndex; }
    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
}
