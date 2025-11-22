import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselItem } from './carousel-item.interface';

@Component({
  selector: 'app-infinite-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-carousel.component.html',
  styleUrl: './infinite-carousel.component.css'
})
export class InfiniteCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() items: CarouselItem[] = [];
  @Input() cardWidth: number = 280; // Base width
  @Input() cardGap: number = 24;
  @Input() visibleCards: number = 4;
  @Input() showNavigation: boolean = true;

  // Thêm Output event để emit khi item được click
  @Output() itemClick = new EventEmitter<CarouselItem>();

  displayedItems: CarouselItem[] = [];
  isTransitioning: boolean = false;
  private isScrolling: boolean = false;
  private autoNextIntervalId: any;
  private singleCopyWidth: number = 0;

  effectiveCardWidth: number = 280;
  currentScrollByViewport: boolean = false;

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef<HTMLElement>;
  @ViewChild('carouselContent', { static: false }) carouselContent!: ElementRef<HTMLElement>;

  ngOnInit() {
    if (this.items && this.items.length > 0) {
      this.initializeCarousel();
    }
    this.updateCardWidth(); // Tính toán width ban đầu
    this.setupAutoNext();
  }

  ngAfterViewInit() {
    // Đợi view init xong mới setup scroll listener
    setTimeout(() => {
      this.setupScrollListener();
      this.scrollToStartPosition();
      // Cập nhật lại layout sau khi render
      this.updateCarouselLayout();
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateCardWidth();
    setTimeout(() => {
      this.updateCarouselLayout();
    }, 100);
  }

  private updateCardWidth() {
    const width = window.innerWidth;

    if (width < 640) {
      // Mobile: width nhỏ hơn, khoảng 85% màn hình
      this.effectiveCardWidth = Math.min(280, width * 0.85 - this.cardGap * 2);
      this.currentScrollByViewport = true;
    } else if (width < 1024) {
      // Tablet: giảm một chút
      this.effectiveCardWidth = Math.min(this.cardWidth, width * 0.4);
      this.currentScrollByViewport = false;
    } else {
      // Desktop: dùng width gốc
      this.effectiveCardWidth = this.cardWidth;
      this.currentScrollByViewport = false;
    }

    // Đảm bảo width tối thiểu
    this.effectiveCardWidth = Math.max(200, this.effectiveCardWidth);
  }

  private updateCarouselLayout() {
    if (!this.carouselContent) return;

    setTimeout(() => {
      if (this.carouselContent && this.scrollContainer) {
        const content = this.carouselContent.nativeElement;

        const itemsPerCopy = this.items.length;
        this.singleCopyWidth = itemsPerCopy * (this.effectiveCardWidth + this.cardGap) - this.cardGap;

        if (this.singleCopyWidth === 0 && content.scrollWidth > 0) {
          this.singleCopyWidth = content.scrollWidth / 3;
        }
      }
    }, 50);
  }

  ngOnDestroy() {
    if (this.autoNextIntervalId) {
      clearInterval(this.autoNextIntervalId);
    }
    this.removeScrollListener();
  }

  private initializeCarousel() {
    // Duplicate 3 lần để có đủ không gian: [A,B,C, A,B,C, A,B,C]
    this.displayedItems = [...this.items, ...this.items, ...this.items];
  }

  private setupScrollListener() {
    if (!this.scrollContainer) return;

    const container = this.scrollContainer.nativeElement;

    container.addEventListener('scroll', this.onScroll.bind(this));

    setTimeout(() => {
      this.updateCarouselLayout();
    }, 200);
  }

  private removeScrollListener() {
    if (!this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement;
    container.removeEventListener('scroll', this.onScroll.bind(this));
  }

  private onScroll(event: Event) {
    if (!this.scrollContainer || !this.carouselContent || this.isScrolling) return;

    const container = this.scrollContainer.nativeElement;
    const content = this.carouselContent.nativeElement;

    // Tính lại singleCopyWidth nếu chưa có
    if (this.singleCopyWidth === 0) {
      const itemsPerCopy = this.items.length;
      this.singleCopyWidth = itemsPerCopy * (this.effectiveCardWidth + this.cardGap) - this.cardGap;

      // Nếu vẫn chưa có, tính từ scrollWidth
      if (this.singleCopyWidth === 0 && content.scrollWidth > 0) {
        this.singleCopyWidth = content.scrollWidth / 3;
      }

      if (this.singleCopyWidth === 0) {
        return; // Đợi tính toán xong mới xử lý scroll
      }
    }

    const scrollLeft = container.scrollLeft;
    const scrollWidth = content.scrollWidth;
    const containerWidth = container.clientWidth;

    const threshold = Math.max(30, (this.effectiveCardWidth + this.cardGap) / 2);

    if (scrollLeft + containerWidth >= scrollWidth - threshold) {
      this.isScrolling = true;

      const offsetFromEnd = scrollWidth - (scrollLeft + containerWidth);
      const newScrollLeft = this.singleCopyWidth + offsetFromEnd;

      container.style.scrollBehavior = 'auto';
      container.scrollLeft = newScrollLeft;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
          this.isScrolling = false;
        });
      });
    }
    else if (scrollLeft <= threshold) {
      this.isScrolling = true;

      const offsetFromStart = scrollLeft;
      const newScrollLeft = (2 * this.singleCopyWidth) - offsetFromStart;

      container.style.scrollBehavior = 'auto';
      container.scrollLeft = newScrollLeft;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
          this.isScrolling = false;
        });
      });
    }
  }

  private scrollToStartPosition() {
    if (!this.scrollContainer || !this.carouselContent) return;

    setTimeout(() => {
      if (this.carouselContent && this.scrollContainer) {
        const content = this.carouselContent.nativeElement;
        const container = this.scrollContainer.nativeElement;

        const itemsPerCopy = this.items.length;
        this.singleCopyWidth = itemsPerCopy * (this.effectiveCardWidth + this.cardGap) - this.cardGap;

        if (this.singleCopyWidth === 0 && content.scrollWidth > 0) {
          this.singleCopyWidth = content.scrollWidth / 3;
        }

        if (this.singleCopyWidth > 0) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = this.singleCopyWidth;
          container.style.scrollBehavior = 'smooth';
        }
      }
    }, 300);
  }

  previousItems() {
    if (!this.scrollContainer || this.items.length === 0 || this.isTransitioning || this.isScrolling) return;

    this.isTransitioning = true;
    const container = this.scrollContainer.nativeElement;
    const width = window.innerWidth;

    let scrollAmount: number;
    // Nếu màn hình nhỏ, scroll bằng viewport hiện tại (không cần 25%)
    if (width < 640) {
      scrollAmount = container.clientWidth;
    } else {
      scrollAmount = this.effectiveCardWidth + this.cardGap;
    }

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isTransitioning = false;
    }, 400);
  }

  nextItems(isAuto: boolean = false) {
    if (!this.scrollContainer || this.items.length === 0 || this.isTransitioning || this.isScrolling) return;

    this.isTransitioning = true;
    const container = this.scrollContainer.nativeElement;
    const width = window.innerWidth;

    let scrollAmount: number;
    // Nếu màn hình nhỏ, scroll bằng viewport hiện tại (không cần 25%)
    if (width < 640) {
      scrollAmount = container.clientWidth;
    } else {
      scrollAmount = this.effectiveCardWidth + this.cardGap;
    }

    if (isAuto && scrollAmount < 10) {
      console.warn('Auto scroll: scrollAmount quá nhỏ:', scrollAmount);
    }

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isTransitioning = false;
    }, 400);
  }

  private setupAutoNext() {
    if (this.autoNextIntervalId) {
      clearInterval(this.autoNextIntervalId);
    }
    this.autoNextIntervalId = setInterval(() => {
      if (!this.isTransitioning && !this.isScrolling && this.items.length > 0) {
        const width = window.innerWidth;
        let scrollAmount: number;
        if (width < 640) {
          if (!this.scrollContainer) return;
          scrollAmount = this.scrollContainer.nativeElement.clientWidth;
        } else {
          scrollAmount = this.effectiveCardWidth + this.cardGap;
        }
        if (scrollAmount > 1) { 
          this.nextItems(true);
        }
      }
    }, 3000);
  }

  canGoPrevious(): boolean {
    return this.items.length > 0;
  }

  canGoNext(): boolean {
    return this.items.length > 0;
  }

  // Method xử lý click vào item
  onItemClick(item: CarouselItem) {
    if (item) {
      this.itemClick.emit(item);
    }
  }
}
