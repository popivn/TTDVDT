import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingService } from '../../services/setting.service';
import { processImagePath } from '../../utils/image.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private settingService = inject(SettingService);
  
  isMenuOpen = false;
  banner: string = '';  // URL của banner image

  ngOnInit() {
    this.loadBanner();
  }

  private loadBanner() {
    const settings = this.settingService.getSettingsCache();
    if (settings) {
      const bannerPath = settings['banner'];
      if (bannerPath) {
        const processedPath = processImagePath(bannerPath);
        if (processedPath) {
          this.banner = processedPath;
        }
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

