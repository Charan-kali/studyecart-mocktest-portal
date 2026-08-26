package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    List<QuestionOption> findByQuestionIdOrderByOptionIndexAsc(Long questionId);
}
