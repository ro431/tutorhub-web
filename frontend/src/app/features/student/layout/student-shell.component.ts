import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { ChatWidgetComponent } from '../../../shared/chat/chat-widget.component';

@Component({
  selector: 'app-student-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ChatWidgetComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <app-sidebar></app-sidebar>
      <app-navbar></app-navbar>
      
      <main class="pl-64 pt-20 transition-all duration-300">
        <div class="p-8 max-w-7xl mx-auto">
          <router-outlet></router-outlet>
        </div>
      </main>

      <app-chat-widget></app-chat-widget>
    </div>
  `
})
export class StudentShellComponent { }
