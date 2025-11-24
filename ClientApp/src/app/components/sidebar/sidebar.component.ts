import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  menuItems = [
    { label: 'Dashboard', route: '/force-admin', icon: '📊' },
    { label: 'Quản lý người dùng', route: '/force-admin/users', icon: '👥' },
    { label: 'Quản lý khóa học', route: '/force-admin/courses', icon: '📚' },
    { label: 'Quản lý tin tức', route: '/force-admin/news', icon: '📰' },
    { label: 'Quản lý khoa', route: '/force-admin/faculties', icon: '🏫' },
    { label: 'Quản lý phòng học', route: '/force-admin/classrooms', icon: '🏛️' },
    { label: 'Cài đặt hệ thống', route: '/force-admin/settings', icon: '⚙️' },
    { label: 'Về trang chủ', route: '/home', icon: '🏠' }
  ];
}

