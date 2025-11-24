import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTableItem } from '../course-table/course-table-item.interface';

@Component({
  selector: 'app-course-table-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-table-mobile.component.html',
  styleUrl: './course-table-mobile.component.css'
})
export class CourseTableMobileComponent implements OnInit {
  @Input() data: CourseTableItem[] = [];

  ngOnInit() {
    if (this.data && this.data.length > 0) {
      console.log('Course Table Mobile Data:', this.data);
    }
  }

  formatTuition(tuition: string | number): string {
    if (typeof tuition === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(tuition);
    }
    return tuition;
  }

  onRegisterClick(item: CourseTableItem) {
    console.log('Register clicked for:', item);
    // TODO: Navigate to enrollment form or handle registration
  }
}

