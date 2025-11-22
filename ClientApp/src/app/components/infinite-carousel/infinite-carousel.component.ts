import { Component, Input, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItem } from './carousel-item.interface';

@Component({
  selector: 'app-infinite-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-carousel.component.html',
  styleUrl: './infinite-carousel.component.css'
})
export class InfiniteCarouselComponent implements OnInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() cardWidth: number = 280;
  @Input() cardGap: number = 24;
  @Input() visibleCards: number = 4;
  @Input() showNavigation: boolean = true;

  displayedItems: CarouselItem[] = [];
  translateX: number = 0;
  isTransitioning: boolean = false;
  resetInProgress: boolean = false;

  private autoNextIntervalId: any;

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLElement>;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateVisibleCards();
  }

  ngOnInit() {
    if (this.items && this.items.length > 0) {
      this.initializeCarousel();
    }
    this.setupAutoNext();
  }

  ngOnChanges() {
    if (this.items && this.items.length > 0 && !this.displayedItems.length) {
      this.initializeCarousel();
    }
  }

  ngOnDestroy() {
    if (this.autoNextIntervalId) {
      clearInterval(this.autoNextIntervalId);
    }
  }

  private setupAutoNext() {
    if (this.autoNextIntervalId) {
      clearInterval(this.autoNextIntervalId);
    }
    // Chạy nextItems mỗi 3s
    this.autoNextIntervalId = setInterval(() => {
      // Không tự next nếu đang chuyển động hoặc khi không có đủ items
      if (!this.isTransitioning && !this.resetInProgress && this.items.length > 0) {
        this.nextItems(true);
      }
    }, 3000);
  }

  private updateVisibleCards() {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleCards = 1;
    } else if (width < 1024) {
      this.visibleCards = 2;
    } else {
      this.visibleCards = 4;
    }
  }

  private initializeCarousel() {
    // Duplicate 2 lần: [A,B,C, A,B,C]
    this.displayedItems = [...this.items, ...this.items];
    
    // Bắt đầu ở giữa 2 bản copy (đầu bản copy thứ 2)
    const cardWidthWithGap = this.cardWidth + this.cardGap;
    const singleCopyWidth = this.items.length * cardWidthWithGap;
    this.translateX = -singleCopyWidth;
  }

  previousItems() {
    if (this.items.length === 0 || this.isTransitioning || this.resetInProgress) return;
    
    this.isTransitioning = true;
    const slideDistance = this.cardWidth + this.cardGap;
    this.translateX += slideDistance;
    
    setTimeout(() => {
      this.resetSeamlessly();
      this.isTransitioning = false;
    }, 500);
  }

  /**
   * @param isAuto nếu là true thì là chạy tự động, false là người dùng bấm
   */
  nextItems(isAuto: boolean = false) {
    if (this.items.length === 0 || this.isTransitioning || this.resetInProgress) return;
    
    this.isTransitioning = true;
    const slideDistance = this.cardWidth + this.cardGap;
    this.translateX -= slideDistance;
    
    setTimeout(() => {
      this.resetSeamlessly();
      this.isTransitioning = false;
    }, 500);
  }

  private resetSeamlessly() {
    if (!this.carouselContainer || this.items.length === 0 || this.resetInProgress) {
      return;
    }
    
    const cardWidthWithGap = this.cardWidth + this.cardGap;
    const singleCopyWidth = this.items.length * cardWidthWithGap;
    const container = this.carouselContainer.nativeElement;
    
    // Xử lý scroll qua phải (next)
    if (this.translateX <= -singleCopyWidth) {
      this.resetInProgress = true;
      container.style.transition = 'none';
      
      const remainder = Math.abs(this.translateX) % singleCopyWidth;
      this.translateX = -remainder;
      
      void container.offsetHeight;
      
      requestAnimationFrame(() => {
        container.style.transition = '';
        setTimeout(() => {
          this.resetInProgress = false;
        }, 50);
      });
    }
    
    // Xử lý scroll qua trái (previous)
    if (this.translateX > 0) {
      this.resetInProgress = true;
      container.style.transition = 'none';
      
      const remainder = this.translateX % singleCopyWidth;
      this.translateX = -singleCopyWidth + remainder;
      
      void container.offsetHeight;
      
      requestAnimationFrame(() => {
        container.style.transition = '';
        setTimeout(() => {
          this.resetInProgress = false;
        }, 50);
      });
    }
  }

  getTransformStyle(): string {
    return `translateX(${this.translateX}px)`;
  }

  canGoPrevious(): boolean {
    return this.items.length > 0;
  }

  canGoNext(): boolean {
    return this.items.length > 0;
  }
}
