package com.studyecart.mocktest.controller;

import com.studyecart.mocktest.entity.Subject;
import com.studyecart.mocktest.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectRepository repository;

    public SubjectController(SubjectRepository repository) { this.repository = repository; }

    @GetMapping
    public List<Subject> all() { return repository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> one(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
