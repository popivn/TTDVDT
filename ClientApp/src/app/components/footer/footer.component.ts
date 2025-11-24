import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  fb_url = '';
  globe_url = '';

  private settingService = inject(SettingService);
  ngOnInit() {
    this.loadSettings();
  }
  loadSettings() {
    this.settingService.getAllSettings().subscribe((settings) => {
      this.fb_url = settings.settings?.['fb_link'] ?? '';
      this.globe_url = settings.settings?.['glb_link'] ?? '';
    });
  }
  currentYear = new Date().getFullYear();
  
  // Icons
  faFacebook = faFacebookF;
  faGlobe = faGlobe;
}
