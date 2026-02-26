⭐ Currently under active development

🧩 Task Management REST API

A backend project built using Spring Boot and PostgreSQL to understand how real-world backend systems are designed, structured, and secured.

This project is being developed step-by-step to move beyond basic CRUD applications and learn production-style backend architecture used in industry environments.

🚀 What This Project Does (Current State)

Right now, the application provides a REST API that allows:

Creating users

Creating tasks linked to users

Fetching users and tasks

Persisting data using PostgreSQL

Structured backend using layered architecture

The system follows:

Controller → Service → Repository → Database
Implemented Features

✅ Spring Boot backend setup
✅ PostgreSQL database integration
✅ JPA/Hibernate ORM mapping
✅ User–Task relationship (One-to-Many)
✅ REST APIs for Users and Tasks
✅ Service layer separation
✅ Git version control with incremental development

🧱 Tech Stack

Backend

Java 17

Spring Boot

Spring Web

Spring Data JPA

Spring Security (setup phase)

Database

PostgreSQL

Hibernate ORM

Tools

IntelliJ IDEA

Postman

Git & GitHub

Maven

🏗️ Project Structure
src/main/java/com/argha/taskapi

model/        → Database entities
repository/   → Database access layer
service/      → Business logic
controller/   → REST API endpoints
config/       → Security configuration
dto/          → Request/response models
security/     → JWT authentication (WIP)
🎯 What This Project Is Supposed To Become

The goal is to evolve this into a production-style authenticated backend.

Planned capabilities:

Secure authentication using JWT

Protected API routes

User-specific task management

Validation & exception handling

Unit testing

Dockerized deployment

API documentation

Essentially:

From a learning CRUD API → to a realistic backend service.

🛠️ Development Roadmap (To-Do)
Phase 1 — Database Layer ✅

Entities

Relationships

Repository layer

Phase 2 — REST APIs ✅

User APIs

Task APIs

Service architecture

Phase 3 — Authentication (In Progress)

JWT token generation

Login endpoint

Request authorization

Phase 4 — Improvements

DTO mapping

Password hashing

Validation annotations

Global exception handling

Phase 5 — Testing

JUnit tests

Service testing

Phase 6 — Deployment

Docker setup

Production configuration

💡 Why I’m Building This

Most academic projects focus on features but skip how real backend systems are structured.

This project is my attempt to:

Learn Spring Boot beyond tutorials

Understand layered backend architecture

Practice database design and ORM mapping

Implement authentication and security properly

Build a project that reflects real engineering workflows

The goal is not just to make something work, but to understand how scalable backend systems are built step by step.

⚙️ Running the Project
1. Clone Repository
git clone https://github.com/oddproblem/Task-Management-REST-API.git
cd Task-Management-REST-API
2. Configure Database

Create PostgreSQL database:

CREATE DATABASE taskdb;

Update credentials in:

src/main/resources/application.properties
3. Run Application
mvn spring-boot:run

Server starts at:

http://localhost:8080
🧪 Example Endpoints
Create User
POST /users
Get Users
GET /users
Create Task
POST /tasks
Get Tasks
GET /tasks
📈 Development Philosophy

This repository is intentionally built in incremental phases with clear commits to reflect real development progress rather than a single finished upload.

👨‍💻 Author

Argha Saha
Computer Science Student | Backend Development Learner
