import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../../services/course.service';
import { ClassroomService, Classroom } from '../../../services/classroom.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-courses-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './courses-management.component.html',
  styleUrl: './courses-management.component.css'
})
export class CoursesManagementComponent implements OnInit {
  private courseService = inject(CourseService);
  private classroomService = inject(ClassroomService);
  private fb = inject(FormBuilder);

  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faTimes = faTimes;

  // Data
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  classrooms: Classroom[] = [];
  selectedCourses: Set<number> = new Set();
  
  // UI State
  isLoading = false;
  showModal = false;
  isEditMode = false;
  editingId = 0;
  searchTerm = '';
  selectedClassroomFilter = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Messages
  errorMessage = '';
  successMessage = '';

  // Form
  courseForm: FormGroup;

  constructor() {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      tuition: ['', [Validators.required, Validators.min(0)]],
      classId: ['', [Validators.required]]
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
        }
      },
      error: (error) => {
        console.error('Error loading classrooms:', error);
      }
    });
  }

  loadCourses() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.courses) {
          this.courses = response.courses;
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách courses';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi tải danh sách courses';
        console.error('Error loading courses:', error);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.courses];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.duration.toString().includes(term) ||
        c.tuition.toString().includes(term)
      );
    }

    // Classroom filter
    if (this.selectedClassroomFilter) {
      const classId = parseInt(this.selectedClassroomFilter);
      filtered = filtered.filter(c => c.classId === classId);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[this.sortColumn as keyof Course];
      let bVal: any = b[this.sortColumn as keyof Course];
      
      // Handle nested properties
      if (this.sortColumn === 'classroom') {
        aVal = a.classroom?.classroomName || '';
        bVal = b.classroom?.classroomName || '';
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.filteredCourses = filtered;
    this.currentPage = 1;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingId = 0;
    this.courseForm.reset();
    this.showModal = true;
  }

  openEditModal(course: Course) {
    this.isEditMode = true;
    this.editingId = course.id;
    this.courseForm.patchValue({
      name: course.name,
      duration: course.duration,
      tuition: course.tuition,
      classId: course.classId.toString()
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = 0;
    this.courseForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    const formValue = this.courseForm.value;
    const courseData: Partial<Course> = {
      name: formValue.name,
      duration: parseInt(formValue.duration),
      tuition: parseFloat(formValue.tuition),
      classId: parseInt(formValue.classId)
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode) {
      this.courseService.updateCourse(this.editingId, courseData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Cập nhật course thành công!';
            this.loadCourses();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể cập nhật course';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi cập nhật course';
          console.error('Error updating course:', error);
        }
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Tạo course thành công!';
            this.loadCourses();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể tạo course';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi tạo course';
          console.error('Error creating course:', error);
        }
      });
    }
  }

  deleteCourse(id: number) {
    if (!confirm(`Bạn có chắc chắn muốn xóa course này?`)) {
      return;
    }

    this.isLoading = true;
    this.courseService.deleteCourse(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Xóa course thành công!';
          this.loadCourses();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Không thể xóa course';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi xóa course';
        console.error('Error deleting course:', error);
      }
    });
  }

  toggleSelection(id: number) {
    if (this.selectedCourses.has(id)) {
      this.selectedCourses.delete(id);
    } else {
      this.selectedCourses.add(id);
    }
  }

  toggleSelectAll() {
    if (this.selectedCourses.size === this.paginatedCourses.length) {
      this.selectedCourses.clear();
    } else {
      this.paginatedCourses.forEach(c => this.selectedCourses.add(c.id));
    }
  }

  deleteSelected() {
    const count = this.selectedCourses.size;
    if (count === 0) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa ${count} course(s)?`)) {
      return;
    }

    this.isLoading = true;
    const ids = Array.from(this.selectedCourses);
    let completed = 0;
    let errors = 0;

    ids.forEach(id => {
      this.courseService.deleteCourse(id).subscribe({
        next: (response) => {
          completed++;
          if (!response.success) errors++;
          
          if (completed === ids.length) {
            this.isLoading = false;
            if (errors === 0) {
              this.successMessage = `Đã xóa ${count} course(s) thành công!`;
              this.selectedCourses.clear();
              this.loadCourses();
            } else {
              this.errorMessage = `Đã xóa ${count - errors} course(s), ${errors} lỗi`;
              this.loadCourses();
            }
          }
        },
        error: () => {
          completed++;
          errors++;
          if (completed === ids.length) {
            this.isLoading = false;
            this.errorMessage = `Đã xóa ${count - errors} course(s), ${errors} lỗi`;
            this.loadCourses();
          }
        }
      });
    });
  }

  getClassroomName(classId: number): string {
    const classroom = this.classrooms.find(c => c.id === classId);
    return classroom?.classroomName || 'N/A';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  get paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCourses.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get hasSelection(): boolean {
    return this.selectedCourses.size > 0;
  }

  get isAllSelected(): boolean {
    return this.paginatedCourses.length > 0 && 
           this.paginatedCourses.every(c => this.selectedCourses.has(c.id));
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredCourses.length);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.courseForm.get('name');
  }

  get duration() {
    return this.courseForm.get('duration');
  }

  get tuition() {
    return this.courseForm.get('tuition');
  }

  get classId() {
    return this.courseForm.get('classId');
  }
}

