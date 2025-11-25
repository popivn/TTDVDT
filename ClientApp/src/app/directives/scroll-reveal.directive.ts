import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() animationClass = 'opacity-100 translate-y-0'; // class khi reveal
  @Input() delay = 0; // delay animation (ms)
  @Input() threshold = 0.1; // threshold cho Intersection Observer

  private observer?: IntersectionObserver;
  private isRevealed = false; // Track trạng thái reveal

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Set initial hidden state
    this.setHiddenState();

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element vào viewport → Reveal
          this.reveal();
        } else if (this.isRevealed) {
          // Element ra khỏi viewport và đã reveal trước đó → Reset về hidden
          this.resetToHidden();
        }
      },
      {
        threshold: this.threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger khi element còn cách viewport 50px
      }
    );

    // Start observing (KHÔNG unobserve để có thể lặp lại)
    this.observer.observe(this.el.nativeElement);
  }

  private setHiddenState() {
    // Set initial hidden state
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.addClass(this.el.nativeElement, 'translate-y-8');
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-700');

    // Apply delay if provided
    if (this.delay > 0) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.delay}ms`);
    }
  }

  private reveal() {
    if (this.isRevealed) return; // Đã reveal rồi thì không làm gì

    // Remove hidden classes
    this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
    this.renderer.removeClass(this.el.nativeElement, 'translate-y-8');
    
    // Add reveal classes
    const classes = this.animationClass.split(' ');
    classes.forEach(cls => {
      this.renderer.addClass(this.el.nativeElement, cls);
    });

    this.isRevealed = true;
  }

  private resetToHidden() {
    if (!this.isRevealed) return; // Chưa reveal thì không cần reset

    // Remove reveal classes
    const classes = this.animationClass.split(' ');
    classes.forEach(cls => {
      this.renderer.removeClass(this.el.nativeElement, cls);
    });

    // Add hidden classes lại
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.addClass(this.el.nativeElement, 'translate-y-8');

    this.isRevealed = false;
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

