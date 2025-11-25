import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, ScrollRevealDirective],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.components.css'
})
export class MainLayoutComponent {
}
  