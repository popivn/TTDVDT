import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BannerComponent } from '../banner/banner.component';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import { NewsCardComponent } from '../news-card/news-card.component';
import { FooterComponent } from '../footer/footer.component';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    ServiceCardComponent,
    CourseCardComponent,
    NewsCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private settingService = inject(SettingService);

  ngOnInit() {
    // Chỉ log settings một lần khi khởi tạo, không retry nữa
    this.logSettings();
  }

  private logSettings() {
    const settings = this.settingService.getSettingsCache();
    console.log('Settings data in HomeComponent:', settings);
    
    if (settings) {
      console.log('All settings keys:', Object.keys(settings));
      console.log('All settings values:', Object.values(settings));
      
      // Log từng setting
      Object.entries(settings).forEach(([key, value]) => {
        console.log(`Setting [${key}]:`, value);
      });
    } else {
      console.warn('Settings cache is empty. Settings may not have been loaded yet.');
    }
  }

  services = [
    {
      title: 'Đăng ký tư vấn',
      icon: 'headset'
    },
    {
      title: 'Câu hỏi thường gặp',
      icon: 'question'
    }
  ];

  courses = [
    {
      title: 'Ngoại ngữ',
      description: 'Tự tin giao tiếp toàn cầu'
    },
    {
      title: 'Tin học ứng dụng',
      description: 'Thành thạo công nghệ'
    }
  ];

  news = [
    {
      date: '15/10/2023',
      title: 'Hội thảo Kỹ năng Giao tiếp Hiệu quả trong Môi trường...'
    },
    {
      date: '12/10/2023',
      title: 'Khai giảng khóa Luyện thi TOEIC cấp tốc tháng 11'
    },
    {
      date: '05/10/2023',
      title: 'Thông báo tuyển sinh các lớp Tin học văn phòng MOS'
    }
  ];
}
