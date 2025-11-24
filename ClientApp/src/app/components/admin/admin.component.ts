import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalCourses: 0,
    totalNews: 0,
    totalSettings: 0
  };

  recentActivities = [
    { id: 1, action: 'Người dùng mới đăng ký', time: '2 giờ trước', type: 'user' },
    { id: 2, action: 'Khóa học mới được tạo', time: '5 giờ trước', type: 'course' },
    { id: 3, action: 'Tin tức được cập nhật', time: '1 ngày trước', type: 'news' },
    { id: 4, action: 'Cài đặt được thay đổi', time: '2 ngày trước', type: 'setting' }
  ];

  quickActions = [
    { label: 'Quản lý người dùng', route: '/admin/users', icon: '👥' },
    { label: 'Quản lý khóa học', route: '/admin/courses', icon: '📚' },
    { label: 'Quản lý tin tức', route: '/admin/news', icon: '📰' },
    { label: 'Cài đặt hệ thống', route: '/admin/settings', icon: '⚙️' }
  ];

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // TODO: Load actual stats from API
    // For now, using mock data
    this.stats = {
      totalUsers: 150,
      totalCourses: 45,
      totalNews: 120,
      totalSettings: 8
    };
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'user': '👤',
      'course': '📚',
      'news': '📰',
      'setting': '⚙️'
    };
    return icons[type] || '📋';
  }
}

