package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.MockTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MockTestRepository extends JpaRepository<MockTest, Long> {
    List<MockTest> findByActiveTrueOrderByIdAsc();
}
