import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseTableItem } from './course-table-item.interface';
import { EventBusService } from '../../services/event-bus.service'; // Thêm import

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.css'
})
export class CourseTableComponent implements OnInit {
  @Input() data: CourseTableItem[] = [];
  @Output() onRegister: EventEmitter<CourseTableItem> = new EventEmitter<CourseTableItem>();

  private eventBus = inject(EventBusService); // Inject EventBusService

  ngOnInit() {
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
