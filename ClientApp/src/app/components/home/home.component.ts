import { Component, inject, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from '../banner/banner.component';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { FooterComponent } from '../footer/footer.component';
import { SettingService } from '../../services/setting.service';
import { FacultyService, Faculty } from '../../services/faculty.service';
import { ClassroomService, Classroom } from '../../services/classroom.service';
import { processImagePath } from '../../utils/image.utils';
import { InfiniteCarouselComponent } from '../infinite-carousel/infinite-carousel.component';
import { CarouselItem } from '../infinite-carousel/carousel-item.interface';
import { CollapseComponent } from '../collapse/collapse.component';
import { CollapseItem } from '../collapse/collapse-item.interface';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { EnrollmentFormComponent } from '../enrollment-form/enrollment-form.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CourseTableItem } from '../course-table/course-table-item.interface';
// Khai báo icon Close (brand) từ thư viện đã cài (ví dụ: FontAwesome)
import { faXmark as faClose } from '@fortawesome/free-solid-svg-icons'; // hoặc từ brands nếu dùng brands
import { EventBusService } from '../../services/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    ServiceCardComponent,
    CourseCardComponent,
    NewsCardComponent,
    InfiniteCarouselComponent, // Thêm component mới
    CollapseComponent, // Thêm component mới
    ScrollRevealDirective, // Directive cho scroll reveal animation
    EnrollmentFormComponent,
    FaIconComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private settingService = inject(SettingService);
  private facultyService = inject(FacultyService);
  private classroomService = inject(ClassroomService);
  private eventBus = inject(EventBusService); // Thêm inject EventBusService

  // Icon Close khai báo để dùng trong template
  faClose = faClose;
  faculties: Faculty[] = [];
  classrooms: Classroom[] = [];
  displayedClassrooms: Classroom[] = [];
  currentClassroomIndex: number = 4;
  visibleCards: number = 4;
  translateX: number = 0;
  cardWidth: number = 280;
  cardGap: number = 24;
  isTransitioning: boolean = false;
  resetInProgress: boolean = false; 
  loading = false;
  loadingClassrooms = false;
  error: string | null = null;
  classroomError: string | null = null;
  showRegisterForm: boolean = false; // dùng để hiển thị popup/form
  
  // Subscription để unsubscribe khi component destroy
  private registerClickSubscription?: Subscription;

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef<HTMLElement>;
  selectedItem?: CourseTableItem;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateVisibleCards();
  }

  ngOnInit() {
    this.updateVisibleCards();
    // Chỉ log settings một lần khi khởi tạo, không retry nữa
    this.logSettings();
    // Load faculties from API
    this.loadFaculties();
    // Load classrooms from API
    this.loadClassrooms();
    
    // Subscribe để nhận event từ CourseTableComponent
    this.subscribeToRegisterClick();
  }

  private updateVisibleCards() {
    const width = window.innerWidth;
    if (width < 640) {
      this.visibleCards = 1; // Mobile
    } else if (width < 1024) {
      this.visibleCards = 2; // Tablet
    } else {
      this.visibleCards = 4; // Desktop
    }
  }

  private logSettings() {
    const settings = this.settingService.getSettingsCache();
    
    if (settings) {
      Object.entries(settings).forEach(([key, value]) => {
      });
    }
  }

  private loadFaculties() {
    this.loading = true;
    this.error = null;
    
    this.facultyService.getAllFaculties().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.faculties) {
          // Process image URLs for each faculty
          this.faculties = response.faculties.map(faculty => ({
            ...faculty,
            imageUrl: processImagePath(faculty.imageUrl || '')
          }));
        } else {
          this.error = response.message || 'Failed to load faculties';
          console.error('Error loading faculties:', this.error);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load faculties. Please try again later.';
        console.error('Error loading faculties:', err);
      }
    });
  }

  carouselItems: CarouselItem[] = [];

  private loadClassrooms() {
    this.loadingClassrooms = true;
    this.classroomError = null;
    
    this.classroomService.getAllClassrooms().subscribe({
      next: (response) => {
        this.loadingClassrooms = false;
        if (response.success && response.classrooms) {
          // Chuyển đổi classrooms thành CarouselItem
          this.carouselItems = response.classrooms.map(classroom => ({
            id: classroom.id, 
            imageUrl: processImagePath(classroom.imageUrl || '') || 'assets/images/no-image.png',
            name: classroom.classroomName,
            description: classroom.description
          }));
        } else {
          this.classroomError = response.message || 'Failed to load classrooms';
          console.error('Error loading classrooms:', this.classroomError);
        }
      },
      error: (err) => {
        this.loadingClassrooms = false;
        this.classroomError = 'Failed to load classrooms. Please try again later.';
        console.error('Error loading classrooms:', err);
      }
    });
  }

  // Xóa tất cả các methods carousel (previousClassrooms, nextClassrooms, resetSeamlessly, etc.)
  // Vì giờ đã được xử lý trong InfiniteCarouselComponent

  // Get transform style - kiểm tra nếu đang reset thì không có transition
  getTransformStyle(): string {
    return `translateX(${this.translateX}px)`;
  }

  // Check if can go to previous
  canGoPrevious(): boolean {
    return this.classrooms.length > 0;
  }

  // Check if can go to next
  canGoNext(): boolean {
    return this.classrooms.length > 0;
  }

  // Thêm ViewChild để tham chiếu đến collapse component
  @ViewChild(CollapseComponent) collapseComponent!: CollapseComponent;
  
  // Hoặc có thể dùng ElementRef để scroll đến section
  @ViewChild('collapseSection', { static: false }) collapseSection!: ElementRef;

  // Method xử lý khi item trong carousel được click
  onCarouselItemClick(item: any) {
    if (item && this.collapseComponent) {
      // Expand item trong collapse theo name
      this.collapseComponent.expandItemByName(item.name);
      
      // Scroll đến section collapse
      this.scrollToCollapseSection();
    }
  }

  // Method scroll đến section collapse
  scrollToCollapseSection() {
    const section = document.getElementById('pending-class-list');
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Hoặc có thể scroll với offset để không bị che bởi header/fixed elements
      setTimeout(() => {
        const yOffset = -80; // Offset để không bị che
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }

  onOpenRegisterForm() {
    this.showRegisterForm = true; // bật hiển thị popup/form
  }

  closeRegisterForm() {
    this.showRegisterForm = false; // dùng để đóng form
  }

  /**
   * Xử lý khi nhận event register click từ CourseTableComponent
   */
  onRegister(item: CourseTableItem) {
    this.selectedItem = item;
    this.showRegisterForm = true;
  }

  /**
   * Subscribe để nhận event register click từ CourseTableComponent
   * (không cần đi qua CollapseComponent)
   */
  private subscribeToRegisterClick(): void {
    this.registerClickSubscription = this.eventBus.registerClick$.subscribe(item => {
      this.onRegister(item);
    });
  }

  ngOnDestroy() {
    // Unsubscribe để tránh memory leak
    if (this.registerClickSubscription) {
      this.registerClickSubscription.unsubscribe();
    }
  }
}
