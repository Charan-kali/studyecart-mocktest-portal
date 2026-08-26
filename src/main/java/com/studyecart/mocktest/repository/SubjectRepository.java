package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SubjectRepository extends JpaRepository<Subject, Long> {}
