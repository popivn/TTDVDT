import { Component, inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTableItem } from '../course-table/course-table-item.interface';
import { EventBusService } from '../../services/event-bus.service';
@Component({
  selector: 'app-course-table-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-table-mobile.component.html',
  styleUrl: './course-table-mobile.component.css'
})
export class CourseTableMobileComponent implements OnInit {
  @Input() data: CourseTableItem[] = [];
  @Output() onRegister: EventEmitter<CourseTableItem> = new EventEmitter<CourseTableItem>();
  private eventBus = inject(EventBusService); // Inject EventBusService
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
    
    // Emit qua EventBus (trực tiếp đến HomeComponent)
    this.eventBus.emitRegisterClick(item);
    
    // Vẫn emit qua @Output() để backward compatible (nếu CollapseComponent cần)
    this.onRegister.emit(item);
  }
}

