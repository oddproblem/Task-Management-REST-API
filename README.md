# Task Management REST API

A professional, production-ready backend project designed to demonstrate secure task orchestration using Spring Boot and PostgreSQL. This project moves beyond basic CRUD to implement industry-standard layered architecture and JWT-based authentication.

## 🚀 Overview

This application provides a robust API for user management and task tracking. It is built with a focus on scalability, security, and clean code principles.

### Key Features
- **Secure Authentication**: JWT-based login and registration system.
- **Task Orchestration**: Full CRUD capabilities for tasks linked to specific users.
- **Layered Architecture**: Clear separation of concerns (Controller, Service, Repository).
- **Relational Persistence**: PostgreSQL integration with JPA/Hibernate.
- **API Documentation**: Integrated Swagger/OpenAPI for interactive testing.

## 🖼️ Visuals

<p align="center">
  <img src="ss/landing%20page.png" alt="Landing Page" width="45%">
  <img src="ss/authentication%20page.png" alt="Authentication Page" width="45%">
</p>
<p align="center">
  <img src="ss/task%20adder.png" alt="Task Management" width="70%">
</p>

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Language** | Java 17 |
| **Framework** | Spring Boot 4.0.3 |
| **Persistence** | Spring Data JPA, Hibernate |
| **Database** | PostgreSQL |
| **Security** | Spring Security, JJWT |
| **Documentation** | SpringDoc OpenAPI (Swagger) |
| **Build Tool** | Maven |

## ⚙️ Setup & Running

### Prerequisites
- Java 17 or higher
- PostgreSQL service running

### 1. Database Configuration
Create a PostgreSQL database named `taskdb`:
```sql
CREATE DATABASE taskdb;
```
Configure your credentials in `src/main/resources/application.properties`.

### 2. Start Backend
Run the application using the Maven wrapper:
```bash
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 3. Start Frontend
Serve the frontend directory (e.g., using Python):
```bash
cd frontend
python -m http.server 3000
```
Access the UI at `http://localhost:3000`.

## 🧪 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate and get JWT |
| `GET` | `/users` | List all users (Protected) |
| `GET` | `/tasks` | Get tasks for current user (Protected) |
| `POST` | `/tasks` | Create a new task (Protected) |

---
Developed with ❤️ by [Argha Saha](https://github.com/oddproblem)
