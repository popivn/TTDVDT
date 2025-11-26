import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { 
  faChartLine, 
  faBook, 
  faBuilding, 
  faGear, 
  faHome,
  faBars,
  faXmark,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

interface MenuItem {
  label: string;
  route: string;
  icon: any;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FaIconComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = false;

  // Icons
  faBars = faBars;
  faXmark = faXmark;
  faChartLine = faChartLine;
  faBook = faBook;
  faBuilding = faBuilding;
  faGear = faGear;
  faHome = faHome;
  faUserPlus = faUserPlus;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/force-admin', icon: faChartLine },
    { label: 'Quản lý khóa học', route: '/force-admin/courses', icon: faBook },
    { label: 'Quản lý phòng học', route: '/force-admin/classrooms', icon: faBuilding },
    { label: 'Quản lý đăng ký', route: '/force-admin/registrations', icon: faUserPlus },
    { label: 'Cài đặt hệ thống', route: '/force-admin/settings', icon: faGear },
    { label: 'Về trang chủ', route: '/home', icon: faHome }
  ];
}

