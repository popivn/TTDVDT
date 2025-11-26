import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegistrationService, Registration } from '../../../services/registration.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash, faSearch, faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-registrations-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './registrations-management.component.html',
  styleUrl: './registrations-management.component.css'
})
export class RegistrationsManagementComponent implements OnInit {
  private registrationService = inject(RegistrationService);

  // Icons
  faTrash = faTrash;
  faSearch = faSearch;
  faDownload = faDownload;
  faFileExcel = faFileExcel;

  // Data
  registrations: Registration[] = [];
  filteredRegistrations: Registration[] = [];
  
  // UI State
  isLoading = false;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  deletingId: number | null = null;
  
  // Messages
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadRegistrations();
  }

  loadRegistrations() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.registrationService.getAllRegistrations().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.registrations) {
          this.registrations = response.registrations;
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'Không thể tải danh sách đăng ký';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi tải danh sách đăng ký';
        console.error('Error loading registrations:', error);
      }
    });
  }

  applyFilters() {
    let filtered = [...this.registrations];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.fullName.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phoneNumber.includes(term) ||
        r.classroomName.toLowerCase().includes(term) ||
        r.courseName.toLowerCase().includes(term) ||
        (r.note && r.note.toLowerCase().includes(term))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[this.sortColumn as keyof Registration];
      let bVal: any = b[this.sortColumn as keyof Registration];
      
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

    this.filteredRegistrations = filtered;
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

  deleteRegistration(id: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa đăng ký này không?')) {
      return;
    }

    this.deletingId = id;
    this.errorMessage = '';
    this.successMessage = '';

    this.registrationService.deleteRegistration(id).subscribe({
      next: (response) => {
        this.deletingId = null;
        if (response.success) {
          this.successMessage = 'Xóa đăng ký thành công!';
          this.loadRegistrations();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message || 'Không thể xóa đăng ký';
        }
      },
      error: (error) => {
        this.deletingId = null;
        this.errorMessage = 'Lỗi khi xóa đăng ký';
        console.error('Error deleting registration:', error);
      }
    });
  }

  exportToExcel() {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = this.filteredRegistrations.map(r => ({
      'STT': this.filteredRegistrations.indexOf(r) + 1,
      'Họ và tên': r.fullName,
      'Email': r.email,
      'Số điện thoại': r.phoneNumber,
      'Lớp học': r.classroomName,
      'Khóa học': r.courseName,
      'Ghi chú': r.note || '',
      'Ngày đăng ký': r.createdAt ? new Date(r.createdAt).toLocaleString('vi-VN') : ''
    }));

    // Tạo worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Đặt độ rộng cột
    const colWidths = [
      { wch: 5 },   // STT
      { wch: 25 },  // Họ và tên
      { wch: 30 },  // Email
      { wch: 15 },  // Số điện thoại
      { wch: 20 },  // Lớp học
      { wch: 25 },  // Khóa học
      { wch: 30 },  // Ghi chú
      { wch: 20 }   // Ngày đăng ký
    ];
    ws['!cols'] = colWidths;

    // Tạo workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Đăng ký');

    // Tải file
    const fileName = `Danh_sach_dang_ky_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredRegistrations.length / this.itemsPerPage);
  }

  get paginatedRegistrations(): Registration[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRegistrations.slice(start, end);
  }

  get paginationStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredRegistrations.length);
  }

  goToFirstPage() {
    this.currentPage = 1;
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

  goToLastPage() {
    this.currentPage = this.totalPages;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString('vi-VN');
  }
}

