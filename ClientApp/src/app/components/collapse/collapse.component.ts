import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CollapseItem } from './collapse-item.interface';
import { CourseTableComponent } from '../course-table/course-table.component';
import { CourseTableItem } from '../course-table/course-table-item.interface';
import { CourseTableMobileComponent } from '../course-table-mobile/course-table-mobile.component';

@Component({
  selector: 'app-collapse',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    CourseTableComponent,
    CourseTableMobileComponent
  ],
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.css'
})
export class CollapseComponent implements OnInit {
  @Input() items: CollapseItem[] = [];
  windowWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;
  }
  // Icon cho chevron down
  faChevronDown = faChevronDown;

  // Lưu trạng thái mở/đóng của từng item (key là id)
  expandedItems: Set<number | string> = new Set();

  ngOnInit() {
    // Khởi tạo nếu cần
  }

  // Toggle collapse cho một item
  toggleItem(itemId: number | string) {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  // Kiểm tra item có đang mở không
  isExpanded(itemId: number | string): boolean {
    return this.expandedItems.has(itemId);
  }

  // Thêm method để expand item theo name hoặc id từ bên ngoài
  expandItemByName(name: string) {
    const item = this.items.find(i => i.name === name);
    
    if (item) {
      // Nếu chưa mở thì mở nó
      if (!this.expandedItems.has(item.id)) {
        this.expandedItems.add(item.id);
      }
    }
  }

  expandItemById(id: number | string) {
    const item = this.items.find(i => i.id === id);
    
    if (item) {
      // Nếu chưa mở thì mở nó
      if (!this.expandedItems.has(item.id)) {
        this.expandedItems.add(item.id);
      }
    }
  }

  // Lấy dữ liệu khóa học cho một item (có thể mở rộng sau)
  getCourseDataForItem(itemId: number | string): CourseTableItem[] {
    // TODO: Thay thế bằng logic lấy dữ liệu thực tế từ API hoặc service
    // Hiện tại trả về mảng rỗng để hiển thị "Chưa có dữ liệu"
    return [];
  }
}
