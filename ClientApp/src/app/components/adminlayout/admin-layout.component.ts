import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
@Component({    
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent, FaIconComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  private authService = inject(AuthService);
  userName = signal<string | null>(null);
  userEmail = signal<string | null>(null);  
  isAvatarDropdownOpen = false;

  toggleAvatarDropdown() {
    this.isAvatarDropdownOpen = !this.isAvatarDropdownOpen;
  }
  loadUserInfo() {
    this.authService.getUserName().subscribe({
      next: (name) => {
        this.userName.set(name);
      },
      error: () => {}
    });
    
    this.authService.getUserEmail().subscribe({
      next: (email) => {
        this.userEmail.set(email);
      },
      error: () => {}
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  logoutIcon = faRightFromBracket;
  faBars = faBars;
  faBell = faBell;

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.toggle();
    }
  }

  logout() {
    this.authService.logout();
  }

  // Lấy initials từ userName để hiển thị trong avatar
  getUserInitials(): string {
    const name = this.userName();
    if (!name) return 'AU';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}  