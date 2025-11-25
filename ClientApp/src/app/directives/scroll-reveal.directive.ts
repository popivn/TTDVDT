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

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Set initial hidden state
    this.renderer.addClass(this.el.nativeElement, 'opacity-0');
    this.renderer.addClass(this.el.nativeElement, 'translate-y-8');
    this.renderer.addClass(this.el.nativeElement, 'transition-all');
    this.renderer.addClass(this.el.nativeElement, 'duration-700');

    // Apply delay if provided
    if (this.delay > 0) {
      this.renderer.setStyle(this.el.nativeElement, 'transition-delay', `${this.delay}ms`);
    }

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Remove hidden classes
          this.renderer.removeClass(this.el.nativeElement, 'opacity-0');
          this.renderer.removeClass(this.el.nativeElement, 'translate-y-8');
          
          // Add reveal classes
          const classes = this.animationClass.split(' ');
          classes.forEach(cls => {
            this.renderer.addClass(this.el.nativeElement, cls);
          });

          // Unobserve after reveal (chỉ reveal 1 lần)
          this.observer?.unobserve(this.el.nativeElement);
        }
      },
      {
        threshold: this.threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger khi element còn cách viewport 50px
      }
    );

    // Start observing
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

