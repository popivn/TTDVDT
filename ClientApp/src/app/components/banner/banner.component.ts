import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingService } from '../../services/setting.service';
import { processImagePath } from '../../utils/image.utils';

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
        this.logo = processImagePath(logoPath) || '';
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
        const processedPath = processImagePath(hr1);
        if (processedPath) {
          images.push(processedPath);
        }
      }
      
      if (hr2) {
        const processedPath = processImagePath(hr2);
        if (processedPath) {
          images.push(processedPath);
        }
      }
      
      this.slideImages = images;
    }
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
    // Scroll to the pending class list section
    const pendingClassListSection = document.getElementById('pending-class-list');
    if (pendingClassListSection) {
      pendingClassListSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

