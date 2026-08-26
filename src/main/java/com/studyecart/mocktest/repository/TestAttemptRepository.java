package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    List<TestAttempt> findByStudentIdAndStatus(Long studentId, com.studyecart.mocktest.entity.AttemptStatus status);
    Optional<TestAttempt> findByIdAndStudentId(Long id, Long studentId);
}
