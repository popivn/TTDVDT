import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBook, faBuilding, faGear } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../services/course.service';
import { ClassroomService } from '../../services/classroom.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FaIconComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private courseService = inject(CourseService);
  private classroomService = inject(ClassroomService);
  private settingService = inject(SettingService);

  // Icons
  faBook = faBook;
  faBuilding = faBuilding;
  faGear = faGear;

  stats = {
    totalCourses: 0,
    totalClassrooms: 0,
    totalSettings: 0
  };

  quickActions = [
    { label: 'Quản lý khóa học', route: '/force-admin/courses', icon: faBook },
    { label: 'Quản lý phòng học', route: '/force-admin/classrooms', icon: faBuilding },
    { label: 'Cài đặt hệ thống', route: '/force-admin/settings', icon: faGear }
  ];

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Load courses count
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        if (response.success && response.courses) {
          this.stats.totalCourses = response.courses.length;
        }
      }
    });

    // Load classrooms count
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        if (response.success && response.classrooms) {
          this.stats.totalClassrooms = response.classrooms.length;
        }
      }
    });

    // Load settings count
    this.settingService.getAllSettings().subscribe({
      next: (response) => {
        if (response.success && response.settings) {
          this.stats.totalSettings = Object.keys(response.settings).length;
        }
      }
    });
  }
}

