import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CollapseItem } from './collapse-item.interface';

@Component({
  selector: 'app-collapse',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent
  ],
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.css'
})
export class CollapseComponent implements OnInit {
  @Input() items: CollapseItem[] = [];

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
}
