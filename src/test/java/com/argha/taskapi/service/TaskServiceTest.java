package com.argha.taskapi.service;

import com.argha.taskapi.dto.TaskRequest;
import com.argha.taskapi.dto.TaskResponse;
import com.argha.taskapi.exception.ResourceNotFoundException;
import com.argha.taskapi.model.Task;
import com.argha.taskapi.model.User;
import com.argha.taskapi.repository.TaskRepository;
import com.argha.taskapi.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@test.com");
        testUser.setPassword("hashedpassword");
        testUser.setRole("USER");

        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setCompleted(false);
        testTask.setUser(testUser);

        // Set up security context
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken("test@test.com", null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createTask_ShouldReturnTaskResponse() {
        TaskRequest request = new TaskRequest("New Task", "New Description");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.save(any(Task.class))).thenReturn(testTask);

        TaskResponse result = taskService.createTask(request);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        assertEquals(1L, result.getUserId());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getTasksForCurrentUser_ShouldReturnOnlyUserTasks() {
        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setDescription("Desc 2");
        task2.setCompleted(true);
        task2.setUser(testUser);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findByUserId(1L)).thenReturn(Arrays.asList(testTask, task2));

        List<TaskResponse> result = taskService.getTasksForCurrentUser();

        assertEquals(2, result.size());
        verify(taskRepository, times(1)).findByUserId(1L);
    }

    @Test
    void getTaskById_WhenOwnedByUser_ShouldReturn() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        TaskResponse result = taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void getTaskById_WhenNotOwnedByUser_ShouldThrow() {
        User otherUser = new User();
        otherUser.setId(99L);
        testTask.setUser(otherUser);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(1L));
    }

    @Test
    void toggleComplete_ShouldFlipCompletionStatus() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        Task toggled = new Task();
        toggled.setId(1L);
        toggled.setTitle("Test Task");
        toggled.setDescription("Test Description");
        toggled.setCompleted(true);
        toggled.setUser(testUser);
        when(taskRepository.save(any(Task.class))).thenReturn(toggled);

        TaskResponse result = taskService.toggleComplete(1L);

        assertTrue(result.isCompleted());
    }

    @Test
    void deleteTask_WhenOwnedByUser_ShouldDelete() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask));

        assertDoesNotThrow(() -> taskService.deleteTask(1L));
        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    void deleteTask_WhenNotFound_ShouldThrow() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.deleteTask(99L));
    }
}
