import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeacherSidebarComponent } from './teacher-sidebar.component';
import { TeacherNavbarComponent } from './teacher-navbar.component';
import { ChatWidgetComponent } from '../../../shared/chat/chat-widget.component';

@Component({
  selector: 'app-teacher-shell',
  standalone: true,
  imports: [RouterOutlet, TeacherSidebarComponent, TeacherNavbarComponent, ChatWidgetComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <app-teacher-sidebar></app-teacher-sidebar>
      <app-teacher-navbar></app-teacher-navbar>
      
      <main class="pl-64 pt-20 transition-all duration-300">
        <div class="p-8 max-w-7xl mx-auto">
          <router-outlet></router-outlet>
        </div>
      </main>

      <app-chat-widget></app-chat-widget>
    </div>
  `
})
export class TeacherShellComponent { }
