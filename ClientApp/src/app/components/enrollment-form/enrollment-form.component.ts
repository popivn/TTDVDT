import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomService, Classroom } from '../../services/classroom.service';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './enrollment-form.component.html',
  styleUrl: './enrollment-form.component.css'
})
export class EnrollmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private classroomService = inject(ClassroomService);

  enrollmentForm: FormGroup;
  classrooms: Classroom[] = [];
  courses: { id: number; name: string }[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.enrollmentForm = this.fb.group({
      classroomId: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      note: ['']
    });
  }

  ngOnInit() {
    this.loadClassrooms();
    this.loadCourses();
  }

  loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        if (response.success && response.classrooms) {
          this.classrooms = response.classrooms;
        } else {
          this.errorMessage = 'Không thể tải danh sách lớp học';
        }
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
        this.errorMessage = 'Lỗi khi tải danh sách lớp học';
      }
    });
  }

  loadCourses() {
    // TODO: Replace with actual course service when available
    // For now, using mock data
    this.courses = [
      { id: 1, name: 'Khóa học 1' },
      { id: 2, name: 'Khóa học 2' },
      { id: 3, name: 'Khóa học 3' },
      { id: 4, name: 'Khóa học 4' }
    ];
  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.enrollmentForm.value;
      console.log('Form submitted:', formData);

      // TODO: Replace with actual API call
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.';
        this.enrollmentForm.reset();
      }, 1500);
    } else {
      this.markFormGroupTouched(this.enrollmentForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters for form controls
  get classroomId() {
    return this.enrollmentForm.get('classroomId');
  }

  get courseId() {
    return this.enrollmentForm.get('courseId');
  }

  get fullName() {
    return this.enrollmentForm.get('fullName');
  }

  get phoneNumber() {
    return this.enrollmentForm.get('phoneNumber');
  }

  get email() {
    return this.enrollmentForm.get('email');
  }

  get note() {
    return this.enrollmentForm.get('note');
  }
}

