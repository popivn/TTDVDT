import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit, OnDestroy {
  private settingService = inject(SettingService);
  logo: string = '';
  slideImages: string[] = [];
  currentSlideIndex = 0;
  private slideInterval: any;

  ngOnInit() {
    this.loadSlideImages();
    this.loadLogo();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private loadLogo() {
    const settings = this.settingService.getSettingsCache();
    if (settings) {
      const logoPath = settings['logo'];
      if (logoPath) {
        this.logo = this.processImagePath(logoPath);
      }
    }
  }

  private loadSlideImages() {
    const settings = this.settingService.getSettingsCache();
    
    if (settings) {
      // Get hr1 and hr2 values
      const hr1 = settings['hr1'];
      const hr2 = settings['hr2'];
      
      const images: string[] = [];
      
      if (hr1) {
        images.push(this.processImagePath(hr1));
      }
      
      if (hr2) {
        images.push(this.processImagePath(hr2));
      }
      
      this.slideImages = images;
    }
  }

  private processImagePath(path: string): string {
    if (!path) return '';
    
    // Replace backslashes with forward slashes
    let processedPath = path.replace(/\\/g, '/');
    
    // Remove ClientApp/public prefix if present (handle both forward and backward slashes)
    processedPath = processedPath.replace(/^ClientApp\/public\//i, '');
    processedPath = processedPath.replace(/^ClientApp\\public\\/i, '');
    
    // If it starts with assets, make it relative to root
    if (processedPath.startsWith('assets/')) {
      processedPath = '/' + processedPath;
    } else if (processedPath.startsWith('/assets/')) {
      // Already has leading slash
    } else if (!processedPath.startsWith('/')) {
      // Add leading slash for absolute path from root
      processedPath = '/' + processedPath;
    }
    
    return processedPath;
  }

  private startAutoSlide() {
    if (this.slideImages.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // Change slide every 5 seconds
    }
  }

  nextSlide() {
    if (this.slideImages.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideImages.length;
    }
  }

  previousSlide() {
    if (this.slideImages.length > 0) {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slideImages.length) % this.slideImages.length;
    }
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.slideImages.length) {
      this.currentSlideIndex = index;
    }
  }

  onExploreCourses() {
    // Navigate to courses page or scroll to courses section
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

