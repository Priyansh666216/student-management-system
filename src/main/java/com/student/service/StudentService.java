package com.student.service;

import com.student.dto.StudentDTO;
import com.student.entity.Student;
import com.student.exception.ResourceNotFoundException;
import com.student.exception.DuplicateEmailException;
import com.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " + dto.getEmail());
        }
        Student student = mapToEntity(dto);
        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDTO(student);
    }

    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (!existing.getEmail().equals(dto.getEmail()) &&
                studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + dto.getEmail());
        }

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setCourse(dto.getCourse());
        existing.setAge(dto.getAge());
        existing.setPhone(dto.getPhone());
        existing.setAddress(dto.getAddress());

        Student updated = studentRepository.save(existing);
        return mapToDTO(updated);
    }

    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        studentRepository.delete(student);
    }

    @Transactional(readOnly = true)
    public List<StudentDTO> searchStudents(String keyword) {
        return studentRepository.searchStudents(keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Student mapToEntity(StudentDTO dto) {
        return Student.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .course(dto.getCourse())
                .age(dto.getAge())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .build();
    }

    private StudentDTO mapToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .course(student.getCourse())
                .age(student.getAge())
                .phone(student.getPhone())
                .address(student.getAddress())
                .build();
    }
}