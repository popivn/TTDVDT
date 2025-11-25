import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faBars, faBell } from '@fortawesome/free-solid-svg-icons';

@Component({    
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent, FaIconComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  logoutIcon = faRightFromBracket;
  faBars = faBars;
  faBell = faBell;

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.toggle();
    }
  }
}  