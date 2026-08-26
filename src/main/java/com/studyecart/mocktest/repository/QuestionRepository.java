package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTestIdOrderByQuestionOrderAsc(Long testId);
}
