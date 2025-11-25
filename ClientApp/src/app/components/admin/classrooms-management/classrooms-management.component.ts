import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ClassroomService, Classroom } from '../../../services/classroom.service';
import { processImagePath } from '../../../utils/image.utils';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-classrooms-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './classrooms-management.component.html',
  styleUrl: './classrooms-management.component.css'
})
export class ClassroomsManagementComponent implements OnInit {
  private classroomService = inject(ClassroomService);
  private fb = inject(FormBuilder);

  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faTimes = faTimes;
  faImage = faImage;

  // Data
  classrooms: Classroom[] = [];
  filteredClassrooms: Classroom[] = [];
  selectedClassrooms: Set<number> = new Set();
  
  // UI State
  isLoading = false;
  showModal = false;
  isEditMode = false;
  editingId = 0;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'classroomName';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
  // Messages
  errorMessage = '';
  successMessage = '';

  // Form
  classroomForm: FormGroup;

  constructor() {
    this.classroomForm = this.fb.group({
      classroomName: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      capacity: ['', [Validators.min(1)]],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    this.loadClassrooms();
  }

  loadClassrooms() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.classrooms) {
          this.classrooms = response.classrooms.map(c => ({
            ...c,
            imageUrl: processImagePath(c.imageUrl || '')
          }));
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách classrooms';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi tải danh sách classrooms';
        console.error('Error loading classrooms:', error);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.classrooms];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.classroomName.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[this.sortColumn as keyof Classroom];
      let bVal: any = b[this.sortColumn as keyof Classroom];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal == null) aVal = '';
      if (bVal == null) bVal = '';
      
      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.filteredClassrooms = filtered;
    this.currentPage = 1;
  }

  onSearch() {
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

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.classroomForm.patchValue({ imageUrl: '' });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.editingId = 0;
    this.classroomForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
    this.showModal = true;
  }

  openEditModal(classroom: Classroom) {
    this.isEditMode = true;
    this.editingId = classroom.id;
    this.classroomForm.patchValue({
      classroomName: classroom.classroomName,
      description: classroom.description || '',
      capacity: classroom.capacity || '',
      imageUrl: classroom.imageUrl || ''
    });
    this.imagePreview = classroom.imageUrl || null;
    this.selectedImage = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = 0;
    this.classroomForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    if (this.classroomForm.invalid) {
      this.markFormGroupTouched(this.classroomForm);
      return;
    }

    const formValue = this.classroomForm.value;
    const classroomData: Partial<Classroom> = {
      classroomName: formValue.classroomName,
      description: formValue.description || undefined,
      capacity: formValue.capacity ? parseInt(formValue.capacity) : undefined,
      imageUrl: formValue.imageUrl || undefined
    };

    // TODO: Handle image upload to server
    // For now, we'll use the imageUrl from form
    // In production, you would upload the file first and get the URL

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode) {
      this.classroomService.updateClassroom(this.editingId, classroomData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Cập nhật classroom thành công!';
            this.classroomService.clearCache();
            this.loadClassrooms();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể cập nhật classroom';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi cập nhật classroom';
          console.error('Error updating classroom:', error);
        }
      });
    } else {
      this.classroomService.createClassroom(classroomData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Tạo classroom thành công!';
            this.classroomService.clearCache();
            this.loadClassrooms();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể tạo classroom';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi tạo classroom';
          console.error('Error creating classroom:', error);
        }
      });
    }
  }

  deleteClassroom(id: number) {
    if (!confirm(`Bạn có chắc chắn muốn xóa classroom này?`)) {
      return;
    }

    this.isLoading = true;
    this.classroomService.deleteClassroom(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Xóa classroom thành công!';
          this.classroomService.clearCache();
          this.loadClassrooms();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Không thể xóa classroom';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi xóa classroom';
        console.error('Error deleting classroom:', error);
      }
    });
  }

  toggleSelection(id: number) {
    if (this.selectedClassrooms.has(id)) {
      this.selectedClassrooms.delete(id);
    } else {
      this.selectedClassrooms.add(id);
    }
  }

  toggleSelectAll() {
    if (this.selectedClassrooms.size === this.paginatedClassrooms.length) {
      this.selectedClassrooms.clear();
    } else {
      this.paginatedClassrooms.forEach(c => this.selectedClassrooms.add(c.id));
    }
  }

  deleteSelected() {
    const count = this.selectedClassrooms.size;
    if (count === 0) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa ${count} classroom(s)?`)) {
      return;
    }

    this.isLoading = true;
    const ids = Array.from(this.selectedClassrooms);
    let completed = 0;
    let errors = 0;

    ids.forEach(id => {
      this.classroomService.deleteClassroom(id).subscribe({
        next: (response) => {
          completed++;
          if (!response.success) errors++;
          
          if (completed === ids.length) {
            this.isLoading = false;
            if (errors === 0) {
              this.successMessage = `Đã xóa ${count} classroom(s) thành công!`;
              this.selectedClassrooms.clear();
              this.classroomService.clearCache();
              this.loadClassrooms();
            } else {
              this.errorMessage = `Đã xóa ${count - errors} classroom(s), ${errors} lỗi`;
              this.classroomService.clearCache();
              this.loadClassrooms();
            }
          }
        },
        error: () => {
          completed++;
          errors++;
          if (completed === ids.length) {
            this.isLoading = false;
            this.errorMessage = `Đã xóa ${count - errors} classroom(s), ${errors} lỗi`;
            this.classroomService.clearCache();
            this.loadClassrooms();
          }
        }
      });
    });
  }

  get paginatedClassrooms(): Classroom[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredClassrooms.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClassrooms.length / this.itemsPerPage);
  }

  get hasSelection(): boolean {
    return this.selectedClassrooms.size > 0;
  }

  get isAllSelected(): boolean {
    return this.paginatedClassrooms.length > 0 && 
           this.paginatedClassrooms.every(c => this.selectedClassrooms.has(c.id));
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredClassrooms.length);
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

  get classroomName() {
    return this.classroomForm.get('classroomName');
  }

  get description() {
    return this.classroomForm.get('description');
  }

  get capacity() {
    return this.classroomForm.get('capacity');
  }
}

