import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; // This is the logout icon

@Component({    
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent, FontAwesomeModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;


  logoutIcon = faRightFromBracket;

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.toggle();
    }
  }
}  