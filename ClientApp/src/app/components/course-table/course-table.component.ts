import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTableItem } from './course-table-item.interface';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.css'
})
export class CourseTableComponent implements OnInit {
  @Input() data: CourseTableItem[] = [];

  ngOnInit() {
    if (this.data && this.data.length > 0) {
      console.log('Course Table Data:', this.data);
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

