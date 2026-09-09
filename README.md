# Task Management REST API

A production-grade backend application for secure task orchestration and user management. Built with Spring Boot 4.0.3 and PostgreSQL, this project demonstrates industry-standard patterns including JWT authentication, layered architecture, and comprehensive API documentation.

## About

This project serves as both a **real-world task management solution** and a **comprehensive educational reference** for building enterprise-grade REST APIs with Spring Boot.

### Real-World Use Case
The Task Management API powers team productivity workflows where users can:
- Create, organize, and track tasks across projects
- Securely authenticate and manage their task lists
- Share task visibility with team members (extensible authorization model)
- Maintain audit trails of task completion and modifications

This architecture directly applies to applications like project management tools (Jira-lite), team collaboration platforms, and personal productivity apps that require secure user isolation and efficient task persistence.

### Educational Value
This codebase is designed for developers learning Spring Boot who want to understand:

1. **Authentication & Authorization**
   - JWT token generation and validation
   - Stateless security without session storage
   - Role-based access control (RBAC) patterns
   - User context extraction from Spring Security

2. **Layered Architecture Best Practices**
   - Clear separation: Controllers → Services → Repositories
   - Data Transfer Objects (DTOs) for request/response decoupling
   - Entity mapping with Hibernate ORM
   - Exception handling at application boundaries

3. **REST API Design**
   - RESTful endpoint conventions
   - Proper HTTP methods and status codes
   - Request validation and error responses
   - API documentation with Swagger/OpenAPI

4. **Database Design & ORM**
   - Relational data modeling (User-Task relationship)
   - JPA annotations and Hibernate configuration
   - Query optimization with Spring Data JPA
   - Transaction management in service layer

5. **Security Implementation**
   - Password encryption with bcrypt
   - CORS configuration for frontend integration
   - Protected endpoints with role-based checks
   - Data isolation ensuring users only access their tasks

### Who This Is For
- **Intermediate Java developers** transitioning to Spring Boot
- **Students** learning full-stack web application development
- **Teams** building internal tools or MVPs requiring secure authentication
- **Backend engineers** needing reference implementations of common patterns

## Visuals

<p align="center">
  <img src="ss/landing%20page.png" alt="Landing Page" width="45%">
  <img src="ss/authentication%20page.png" alt="Authentication Page" width="45%">
</p>
<p align="center">
  <img src="ss/task%20adder.png" alt="Task Management" width="70%">
</p>

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)                   │
│            Browser-based UI for Authentication & Tasks      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST + Bearer JWT
                         │
┌────────────────────────┴────────────────────────────────────┐
│               Spring Boot REST API (Port 8080)              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Controllers (HTTP Routes)                │   │
│  │  - AuthController (/auth/register, /auth/login)    │   │
│  │  - TaskController (/tasks CRUD endpoints)          │   │
│  │  - UserController (/users endpoints)               │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │          Services (Business Logic)                  │   │
│  │  - TaskService (task operations & validation)      │   │
│  │  - UserService (user operations & queries)         │   │
│  │  - AuthenticationManager (credential validation)   │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │        Repositories (Data Access Layer)            │   │
│  │  - TaskRepository (JPA queries)                    │   │
│  │  - UserRepository (user lookups)                   │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │     Security & Middleware                          │   │
│  │  - JwtUtil (token generation & validation)         │   │
│  │  - SecurityConfig (Spring Security setup)          │   │
│  │  - GlobalExceptionHandler (error responses)        │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries (JDBC)
                         │
        ┌────────────────┴──────────────────┐
        │                                   │
        v                                   v
   ┌─────────────┐                   ┌───────────────┐
   │ PostgreSQL  │                   │  JPA/Hibernate│
   │  Database   │◄──────ORM─────────┤   (Mapping)   │
   │             │                   │               │
   │ Tables:     │                   │ JPA Entities: │
   │  - users    │                   │  - User       │
   │  - tasks    │                   │  - Task       │
   └─────────────┘                   └───────────────┘
```

### Layered Architecture

| Layer | Responsibility | Key Components |
|-------|-----------------|-----------------|
| **Presentation** | HTTP request handling, input validation, response formatting | `@RestController`, `@RequestMapping` |
| **Business Logic** | Core application logic, authorization checks, data transformation | `@Service`, domain services |
| **Persistence** | Data access abstraction, query definition, ORM mapping | `@Repository`, JPA queries, Hibernate |
| **Security** | Authentication, JWT token management, authorization | Spring Security, `JwtUtil`, `SecurityConfig` |
| **Infrastructure** | Exception handling, cross-cutting concerns, configuration | `GlobalExceptionHandler`, `@Configuration` |

### Data Model

**User Entity:**
- `id` (Long, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, BCrypt Hashed)
- `role` (String, e.g., "USER")

**Task Entity:**
- `id` (Long, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `completed` (Boolean)
- `userId` (Foreign Key → User)

### Request/Response Flow

```
Client Request
    ↓
Controller (Parse & Validate)
    ↓
Service Layer (Business Logic & Authorization)
    ↓
Repository Layer (Database Query)
    ↓
Database (Persist/Retrieve)
    ↓
Repository → Service → Controller → Client Response
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Language** | Java 17 | Modern JDK with performance improvements |
| **Framework** | Spring Boot 4.0.3 | Rapid application development & embedded server |
| **Web** | Spring Web MVC | REST controller and request handling |
| **Security** | Spring Security + JJWT | Authentication and authorization |
| **Persistence** | Spring Data JPA + Hibernate | ORM and database abstraction |
| **Database** | PostgreSQL | Relational data persistence |
| **Documentation** | SpringDoc OpenAPI (Swagger) | Interactive API docs |
| **Build Tool** | Maven | Dependency management and build automation |

## Setup & Installation

### Prerequisites

- Java 17 or higher
- PostgreSQL database server
- Maven 3.8+

### Step 1: Clone the Repository

```bash
git clone https://github.com/oddproblem/Task-Management-REST-API.git
cd Task-Management-REST-API
```

### Step 2: Database Configuration

Create a PostgreSQL database:

```sql
CREATE DATABASE taskdb;
```

Update database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/taskdb
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Step 3: Build and Run Backend

```bash
./mvnw clean spring-boot:run
```

The API will be available at `http://localhost:8080`

**Interactive API Documentation:** `http://localhost:8080/swagger-ui.html`

### Step 4: Start Frontend

Open a new terminal in the `frontend` directory:

```bash
cd frontend
python -m http.server 3000
```

Access the UI at `http://localhost:3000`

## API Reference

All endpoints require JWT authentication (except `/auth/register` and `/auth/login`).

### Authentication

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create a new user account | `{ username, email, password }` |
| `POST` | `/auth/login` | Authenticate and receive JWT | `{ email, password }` |

**Response (Login/Register):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

**Usage:** Include token in Authorization header:
```
Authorization: Bearer <your_token>
```

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/users` | List all users | Yes |
| `GET` | `/users/{id}` | Get user by ID | Yes |

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER"
}
```

### Tasks

| Method | Endpoint | Description | Body | Auth Required |
|--------|----------|-------------|------|---------------|
| `POST` | `/tasks` | Create a new task | `{ title, description }` | Yes |
| `GET` | `/tasks` | Get all tasks for current user | — | Yes |
| `GET` | `/tasks/{id}` | Get task by ID | — | Yes |
| `PUT` | `/tasks/{id}` | Update task details | `{ title, description }` | Yes |
| `PATCH` | `/tasks/{id}/toggle` | Toggle task completion status | — | Yes |
| `DELETE` | `/tasks/{id}` | Delete a task | — | Yes |

**Create Task Request:**
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based login system"
}
```

**Task Response:**
```json
{
  "id": 42,
  "title": "Implement user authentication",
  "description": "Add JWT-based login system",
  "completed": false,
  "userId": 1
}
```

## Project Structure

```
Task-Management-REST-API/
│
├── src/main/java/com/argha/taskapi/
│   ├── controller/                 # HTTP request handlers
│   │   ├── AuthController.java
│   │   ├── TaskController.java
│   │   └── UserController.java
│   │
│   ├── service/                    # Business logic layer
│   │   ├── TaskService.java
│   │   └── UserService.java
│   │
│   ├── repository/                 # Data access layer
│   │   ├── TaskRepository.java
│   │   └── UserRepository.java
│   │
│   ├── model/                      # JPA entities
│   │   ├── Task.java
│   │   └── User.java
│   │
│   ├── dto/                        # Request/response models
│   │   ├── TaskRequest.java
│   │   ├── TaskResponse.java
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── RegisterRequest.java
│   │   └── UserResponse.java
│   │
│   ├── security/                   # Authentication & authorization
│   │   ├── JwtUtil.java
│   │   ├── SecurityConfig.java
│   │   └── JwtAuthenticationFilter.java
│   │
│   ├── exception/                  # Error handling
│   │   ├── ResourceNotFoundException.java
│   │   ├── GlobalExceptionHandler.java
│   │   └── ErrorResponse.java
│   │
│   ├── config/                     # Application configuration
│   │   └── OpenApiConfig.java
│   │
│   └── TaskapiApplication.java     # Main entry point
│
├── src/main/resources/
│   ├── application.properties       # Configuration (DB, JWT secret, etc.)
│   └── application-dev.properties   # Development overrides
│
├── frontend/                        # HTML/CSS/JavaScript UI
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ss/                         # Screenshots
│
├── pom.xml                          # Maven dependencies
└── README.md                        # This file
```

## Key Design Patterns

### 1. Layered Architecture
Request flows through Controllers → Services → Repositories, with clear separation of concerns at each layer.

### 2. JWT-Based Stateless Authentication
- Tokens generated on login contain user identity
- Token validation performed on each protected endpoint
- No server-side session storage required

### 3. Entity Authorization
- Every task operation verifies ownership before allowing modification
- Services extract authenticated user from `SecurityContext`
- Prevents cross-user data access

### 4. Exception Handling
- `GlobalExceptionHandler` catches all exceptions
- Standardized error responses with HTTP status codes
- Validation errors include field-level details

## Security Considerations

- **Password Security:** Passwords are bcrypt-hashed with Spring Security
- **JWT Secret:** Configure a strong `JWT_SECRET` in production
- **CORS:** Configure allowed origins based on your frontend deployment
- **HTTPS:** Always use HTTPS in production environments
- **Token Expiration:** Implement token refresh logic for extended sessions

## Testing

Run unit and integration tests:

```bash
./mvnw test
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `psql -U postgres`
- Check database name in `application.properties`
- Ensure credentials are correct

### JWT Token Invalid
- Verify `JWT_SECRET` matches between token generation and validation
- Check token hasn't expired
- Ensure `Authorization` header format is correct: `Bearer <token>`

### CORS Errors
- Frontend may be blocked by CORS policy
- Configure allowed origins in `SecurityConfig`
- Ensure frontend and backend URLs are correctly set

## Development Workflow

1. **Adding a New Endpoint:**
   - Create method in corresponding `Controller`
   - Add business logic to `Service`
   - Define database query in `Repository`
   - Create DTO classes for request/response
   - Update Swagger documentation

2. **Adding Authentication:**
   - Annotate method with `@PreAuthorize` or check in service layer
   - Extract authenticated user via `SecurityContextHolder`
   - Verify user has access to requested resource

3. **Database Migration:**
   - Modify entity in `model/` directory
   - Update repository queries if needed
   - Hibernate will auto-update schema (if `ddl-auto=create-drop`)

## License

This project is open-source and available for educational and commercial use.

## Author

**Argha Saha** ([@oddproblem](https://github.com/oddproblem))

Designed to demonstrate professional Spring Boot application patterns and best practices for REST API development.

---

**Built with best practices for scalability, security, and maintainability.**
