import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { SettingService, SettingItem } from '../../../services/setting.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './settings-management.component.html',
  styleUrl: './settings-management.component.css'
})
export class SettingsManagementComponent implements OnInit {
  private settingService = inject(SettingService);
  private fb = inject(FormBuilder);

  // Icons
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSearch = faSearch;
  faCheck = faCheck;
  faTimes = faTimes;

  // Data
  settings: SettingItem[] = [];
  filteredSettings: SettingItem[] = [];
  selectedSettings: Set<string> = new Set();
  
  // UI State
  isLoading = false;
  showModal = false;
  isEditMode = false;
  editingKey = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'key';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Messages
  errorMessage = '';
  successMessage = '';

  // Form
  settingForm: FormGroup;

  constructor() {
    this.settingForm = this.fb.group({
      key: ['', [Validators.required, Validators.minLength(1)]],
      value: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.settingService.getAllSettings().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.settings) {
          // Convert dictionary to array
          this.settings = Object.entries(response.settings).map(([key, value]) => ({
            key,
            value
          }));
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách settings';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi tải danh sách settings';
        console.error('Error loading settings:', error);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.settings];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.key.toLowerCase().includes(term) || 
        s.value.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[this.sortColumn as keyof SettingItem] || '';
      const bVal = b[this.sortColumn as keyof SettingItem] || '';
      
      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.filteredSettings = filtered;
    this.currentPage = 1; // Reset to first page
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

  openCreateModal() {
    this.isEditMode = false;
    this.editingKey = '';
    this.settingForm.reset();
    this.showModal = true;
  }

  openEditModal(setting: SettingItem) {
    this.isEditMode = true;
    this.editingKey = setting.key;
    this.settingForm.patchValue({
      key: setting.key,
      value: setting.value
    });
    this.settingForm.get('key')?.disable(); // Disable key in edit mode
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingKey = '';
    this.settingForm.reset();
    this.settingForm.get('key')?.enable();
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    if (this.settingForm.invalid) {
      this.markFormGroupTouched(this.settingForm);
      return;
    }

    const formValue = this.settingForm.getRawValue();
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditMode) {
      // Update
      this.settingService.updateSetting(this.editingKey, formValue.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Cập nhật setting thành công!';
            this.loadSettings();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể cập nhật setting';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi cập nhật setting';
          console.error('Error updating setting:', error);
        }
      });
    } else {
      // Create
      this.settingService.createSetting(formValue.key, formValue.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Tạo setting thành công!';
            this.loadSettings();
            setTimeout(() => this.closeModal(), 1000);
          } else {
            this.errorMessage = response.message || 'Không thể tạo setting';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi tạo setting';
          console.error('Error creating setting:', error);
        }
      });
    }
  }

  deleteSetting(key: string) {
    if (!confirm(`Bạn có chắc chắn muốn xóa setting "${key}"?`)) {
      return;
    }

    this.isLoading = true;
    this.settingService.deleteSetting(key).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Xóa setting thành công!';
          this.loadSettings();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Không thể xóa setting';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi xóa setting';
        console.error('Error deleting setting:', error);
      }
    });
  }

  toggleSelection(key: string) {
    if (this.selectedSettings.has(key)) {
      this.selectedSettings.delete(key);
    } else {
      this.selectedSettings.add(key);
    }
  }

  toggleSelectAll() {
    if (this.selectedSettings.size === this.paginatedSettings.length) {
      this.selectedSettings.clear();
    } else {
      this.paginatedSettings.forEach(s => this.selectedSettings.add(s.key));
    }
  }

  deleteSelected() {
    const count = this.selectedSettings.size;
    if (count === 0) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa ${count} setting(s)?`)) {
      return;
    }

    this.isLoading = true;
    const keys = Array.from(this.selectedSettings);
    let completed = 0;
    let errors = 0;

    keys.forEach(key => {
      this.settingService.deleteSetting(key).subscribe({
        next: (response) => {
          completed++;
          if (!response.success) errors++;
          
          if (completed === keys.length) {
            this.isLoading = false;
            if (errors === 0) {
              this.successMessage = `Đã xóa ${count} setting(s) thành công!`;
              this.selectedSettings.clear();
              this.loadSettings();
            } else {
              this.errorMessage = `Đã xóa ${count - errors} setting(s), ${errors} lỗi`;
              this.loadSettings();
            }
          }
        },
        error: () => {
          completed++;
          errors++;
          if (completed === keys.length) {
            this.isLoading = false;
            this.errorMessage = `Đã xóa ${count - errors} setting(s), ${errors} lỗi`;
            this.loadSettings();
          }
        }
      });
    });
  }

  get paginatedSettings(): SettingItem[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredSettings.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSettings.length / this.itemsPerPage);
  }

  get hasSelection(): boolean {
    return this.selectedSettings.size > 0;
  }

  get isAllSelected(): boolean {
    return this.paginatedSettings.length > 0 && 
           this.paginatedSettings.every(s => this.selectedSettings.has(s.key));
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredSettings.length);
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

  get key() {
    return this.settingForm.get('key');
  }

  get value() {
    return this.settingForm.get('value');
  }
}

