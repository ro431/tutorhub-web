import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { TeacherService } from '../../../core/service/teacher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 transition-all duration-300 flex flex-col">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <span class="material-icons">school</span>
          </div>
          <div>
            <h1 class="font-bold text-slate-800 tracking-tight">TutorHub</h1>
            <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Teacher Panel</p>
          </div>
        </div>

        <nav class="space-y-1">
          @for (item of menuItems; track item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="bg-indigo-50 text-indigo-600 shadow-sm"
               [routerLinkActiveOptions]="{ exact: item.path === '/teacher/overview' }"
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group hover:bg-slate-50 text-slate-600 hover:text-indigo-600">
              <span class="material-icons text-[20px] transition-transform duration-300 group-hover:scale-110">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>
      </div>

      <div class="p-6 mt-auto">
        <button (click)="logout()" 
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-200 group">
          <span class="material-icons text-[20px] group-hover:rotate-12 transition-transform">logout</span>
          Logout
        </button>
      </div>
    </aside>

    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
    </style>
  `
})
export class TeacherSidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private teacherService = inject(TeacherService);

  students = signal<any[]>([]);

  menuItems = [
    { path: '/teacher/overview', icon: 'dashboard', label: 'Dashboard' },
    { path: '/teacher/courses', icon: 'auto_stories', label: 'My Courses' },
    { path: '/teacher/enrollments', icon: 'group_add', label: 'Enrollment Requests' },
    { path: '/teacher/students', icon: 'people', label: 'My Registered Students' },
    { path: '/teacher/live-classes', icon: 'video_camera_front', label: 'Live Classes' },
    { path: '/teacher/profile', icon: 'person', label: 'My Profile' }
  ];

  ngOnInit() {
    // this.loadStudents(); // No longer needed as student list is removed from sidebar
  }

  // loadStudents() { // No longer needed as student list is removed from sidebar
  //   const user = this.authService.currentUser();
  //   if (user) {
  //     this.teacherService.getEnrolledStudents(user.id).subscribe(res => {
  //       this.students.set(res.data || []);
  //     });
  //   }
  // }

  logout() {
    this.authService.logout();
  }
}
