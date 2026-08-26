# StudyEcart Mock Test Backend

Spring Boot + JPA + MySQL backend for the React pages supplied in the conversation.

## Stack
- Java 21
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- MySQL
- No Spring Security
- CORS for Vite (5173) and CRA (3000)

## 1. Create the database

```sql
CREATE DATABASE studyecart_mocktest;
```

If it already exists, that is fine.

## 2. Configure MySQL

Open:

`src/main/resources/application.properties`

and replace:

`YOUR_MYSQL_PASSWORD`

with your MySQL password.

The JDBC URL already contains:

`allowPublicKeyRetrieval=true`

which helps with the MySQL public-key retrieval error encountered in development.

## 3. Run

From the backend folder:

```bash
mvn clean spring-boot:run
```

or run `MockTestBackendApplication` from STS/IntelliJ.

Backend:

`http://localhost:8080`

## 4. Database tables

Hibernate creates/updates these tables:

- users
- subjects
- mock_tests
- questions
- options
- test_attempts
- student_answers

## 5. Main APIs

### Users
POST `/api/users/register`
POST `/api/users/login`
GET `/api/users/{id}`

### Subjects
GET `/api/subjects`
GET `/api/subjects/{id}`

### Mock tests
GET `/api/mock-tests`
GET `/api/mock-tests/{id}`

The question response intentionally does NOT expose the correct answer.

### Attempts
POST `/api/test-attempts/start?studentId=1&testId=1`
POST `/api/test-attempts/{attemptId}/answers`
POST `/api/test-attempts/{attemptId}/submit`
GET `/api/test-attempts/{attemptId}/result`

### Results
GET `/api/results/{id}`
GET `/api/results/student/{studentId}`

### Mentor
GET `/api/mentors/students`
GET `/api/mentors/results`

## Important

This starter backend uses plain-text passwords because the requested development setup has no Spring Security. Do not use this password handling in production.

The backend calculates the score using the correct answer stored in MySQL. The React test API receives question text and options, but not the correct answer.
