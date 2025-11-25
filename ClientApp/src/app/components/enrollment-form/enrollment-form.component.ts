import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomService, Classroom } from '../../services/classroom.service';
import { CourseService } from '../../services/course.service';
import { CourseTableItem } from '../course-table/course-table-item.interface';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
export class EnrollmentFormComponent implements OnInit, OnDestroy {
  @Input() item?: CourseTableItem;  
  private fb = inject(FormBuilder);
  private classroomService = inject(ClassroomService);
  private courseService = inject(CourseService);
  enrollmentForm: FormGroup;
  classrooms: Classroom[] = [];
  courses: { id: number; name: string; classId: number }[] = [];
  isLoading = false;
  isLoadingCourses = false;
  errorMessage = '';
  successMessage = '';
  private classroomIdSubscription?: Subscription;

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
    this.setupClassroomIdListener();
    this.loadClassrooms();
  }

  loadClassrooms() {
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        if (response.success && response.classrooms) {
          this.classrooms = response.classrooms;
          
          // Nếu có item từ input, set giá trị sau khi classrooms đã load
          if (this.item) {
            this.enrollmentForm.patchValue({
              classroomId: this.item.ClassId
            });
            // Load courses cho classId này
            this.loadCoursesByClassId(this.item.ClassId, () => {
              // Sau khi courses load xong, set courseId
              this.enrollmentForm.patchValue({
                courseId: this.item!.Id
              });
            });
          }
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

  /**
   * Setup listener để load courses khi classroomId thay đổi
   */
  private setupClassroomIdListener(): void {
    this.classroomIdSubscription = this.enrollmentForm.get('classroomId')?.valueChanges
      .pipe(
        filter(classroomId => !!classroomId) // Chỉ xử lý khi có giá trị
      )
      .subscribe(classroomId => {
        // Reset courseId khi classroomId thay đổi
        this.enrollmentForm.patchValue({ courseId: '' }, { emitEvent: false });
        
        // Load courses theo classId
        this.loadCoursesByClassId(classroomId);
      });
  }

  /**
   * Load courses theo classId
   */
  loadCoursesByClassId(classId: number, callback?: () => void): void {
    this.isLoadingCourses = true;
    this.courses = []; // Clear courses cũ
    
    this.courseService.getCoursesByClassIdCached(classId).subscribe({
      next: (courses) => {
        this.isLoadingCourses = false;
        this.courses = courses.map(course => ({
          id: course.id,
          name: course.name,
          classId: course.classId
        }));
        
        if (callback) {
          callback();
        }
      },
      error: (error) => {
        this.isLoadingCourses = false;
        this.errorMessage = 'Không thể tải danh sách khóa học';
        console.error('Error loading courses:', error);
      }
    });
  }

  onSubmit() {
    if (this.enrollmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.enrollmentForm.value;

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

  ngOnDestroy() {
    if (this.classroomIdSubscription) {
      this.classroomIdSubscription.unsubscribe();
    }
  }
}

