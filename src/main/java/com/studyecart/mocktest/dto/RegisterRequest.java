package com.studyecart.mocktest.dto;

import com.studyecart.mocktest.entity.Role;

public record RegisterRequest(String name, String email, String password, Role role, String track) {}
