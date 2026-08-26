package com.studyecart.mocktest.config;

import com.studyecart.mocktest.entity.*;
import com.studyecart.mocktest.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository users,
                               SubjectRepository subjects,
                               MockTestRepository tests,
                               QuestionRepository questions,
                               QuestionOptionRepository options) {
        return args -> {
            if (users.count() > 0 || subjects.count() > 0 || tests.count() > 0) return;

            Subject java = subjects.save(new Subject("Java", "#4F68A0"));
            Subject company = subjects.save(new Subject("Company", "#146B3D"));

            User student = new User("Demo Student", "student@studyecart.com", "student123", Role.STUDENT);
            student.setTrack("Java Full Stack");
            student.setAvatarColor("#4F68A0");
            users.save(student);

            User mentor = new User("Demo Mentor", "mentor@studyecart.com", "mentor123", Role.MENTOR);
            mentor.setTrack("Java Full Stack");
            mentor.setAvatarColor("#146B3D");
            users.save(mentor);

            MockTest test = new MockTest();
            test.setTitle("Java Fundamentals Mock Test");
            test.setSubject(java);
            test.setDurationMin(20);
            test.setDifficulty("Standard");
            test.setDescription("Basic Java placement assessment");
            test.setActive(true);
            test = tests.save(test);

            createQuestion(test, "Which keyword is used to inherit a class in Java?",
                    new String[]{"implements", "extends", "inherits", "super"}, 1, 1,
                    questions, options);

            createQuestion(test, "Which method is the entry point of a Java application?",
                    new String[]{"start()", "run()", "main()", "init()"}, 2, 2,
                    questions, options);

            MockTest companyTest = new MockTest();
            companyTest.setTitle("Company Aptitude Mock Test");
            companyTest.setSubject(company);
            companyTest.setDurationMin(15);
            companyTest.setDifficulty("Standard");
            companyTest.setDescription("Company-style assessment");
            companyTest.setActive(true);
            tests.save(companyTest);
        };
    }

    private void createQuestion(MockTest test, String text, String[] opts,
                                int correct, int order,
                                QuestionRepository questions,
                                QuestionOptionRepository options) {
        Question q = new Question();
        q.setTest(test);
        q.setText(text);
        q.setCorrectOptionIndex(correct);
        q.setQuestionOrder(order);
        q = questions.save(q);

        for (int i = 0; i < opts.length; i++) {
            QuestionOption option = new QuestionOption();
            option.setQuestion(q);
            option.setOptionIndex(i);
            option.setOptionText(opts[i]);
            options.save(option);
        }
    }
}
