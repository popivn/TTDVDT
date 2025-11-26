import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassroomService, Classroom } from '../../services/classroom.service';
import { CourseService } from '../../services/course.service';
import { MailService } from '../../services/mail.service';
import { EmailTemplateService } from '../../services/email-template.service';
import { CourseTableItem } from '../course-table/course-table-item.interface';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

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
  private mailService = inject(MailService);
  private emailTemplateService = inject(EmailTemplateService);
  enrollmentForm: FormGroup;
  classrooms: Classroom[] = [];
  courses: { id: number; name: string; classId: number }[] = [];
  isLoading = false;
  isLoadingCourses = false;
  errorMessage = '';
  successMessage = '';
  private classroomIdSubscription?: Subscription;
  private mailSubscription?: Subscription;

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

  onSubmit(event?: Event) {
    // Ngăn chặn double submission
    if (this.isLoading) {
      event?.preventDefault();
      return;
    }

    if (this.enrollmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.enrollmentForm.value;
      
      // Convert string IDs từ form thành number để so sánh
      const classroomId = Number(formData.classroomId);
      const courseId = Number(formData.courseId);
      
      // Lấy thông tin lớp học và khóa học để hiển thị trong email
      const selectedClassroom = this.classrooms.find(c => c.id === classroomId);
      const selectedCourse = this.courses.find(c => c.id === courseId);
      
      // Kiểm tra và log nếu không tìm thấy
      if (!selectedClassroom) {
        console.warn('Classroom not found for ID:', classroomId, 'Available classrooms:', this.classrooms.map(c => ({ id: c.id, name: c.classroomName })));
      }
      if (!selectedCourse) {
        console.warn('Course not found for ID:', courseId, 'Available courses:', this.courses.map(c => ({ id: c.id, name: c.name })));
      }

      // Tạo nội dung email sử dụng EmailTemplateService
      const emailBody = this.emailTemplateService.createEnrollmentConfirmationEmail({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        classroomName: selectedClassroom?.classroomName || 'Chưa xác định',
        courseName: selectedCourse?.name || 'Chưa xác định',
        note: formData.note
      });

      // Gửi email thông qua MailService
      const mailData = this.mailService.buildMailQueueData({
        name: `Xác nhận đăng ký - ${formData.fullName}`,
        subject: 'Xác nhận đăng ký khóa học',
        body: emailBody,
        cc: '',
        code: 'xmhp', // Mã định danh email
        receivers: formData.email
      });

      // Unsubscribe subscription cũ nếu có
      if (this.mailSubscription) {
        this.mailSubscription.unsubscribe();
      }

      // Sử dụng take(1) để đảm bảo chỉ subscribe một lần
      // Response có thể là text hoặc JSON string, cần parse nếu là JSON
      this.mailSubscription = this.mailService.sendMailQueue(mailData).pipe(
        take(1)
      ).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // Response từ .NET API đã là JSON object
          console.log('Mail queue response:', response);
          
          if (response.success) {
            this.successMessage = 'Đăng ký thành công! Email xác nhận đã được gửi đến địa chỉ email của bạn.';
          } else {
            // Vẫn hiển thị thành công cho user, nhưng log warning
            console.warn('Mail queue API returned success=false:', response.message);
            this.successMessage = 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.';
          }
          
          this.enrollmentForm.reset();
          // Reset courses khi reset form
          this.courses = [];
          // Cleanup subscription
          this.mailSubscription?.unsubscribe();
          this.mailSubscription = undefined;
        },
        error: (error) => {
          console.error('Error sending email:', error);
          this.isLoading = false;
          // Vẫn hiển thị thành công nếu có lỗi gửi email (không block user)
          // API có thể thành công nhưng response có lỗi (như CORS), vẫn coi là thành công
          this.successMessage = 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.';
          this.enrollmentForm.reset();
          this.courses = [];
          // Cleanup subscription
          this.mailSubscription?.unsubscribe();
          this.mailSubscription = undefined;
        }
      });
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
    if (this.mailSubscription) {
      this.mailSubscription.unsubscribe();
    }
  }
}

