package com.studyecart.mocktest.repository;

import com.studyecart.mocktest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(com.studyecart.mocktest.entity.Role role);
}
