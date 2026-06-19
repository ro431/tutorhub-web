import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import { TeacherService } from '../../../core/service/teacher.service';
import { ChatService } from '../../../core/service/chat.service';

@Component({
  selector: 'app-teacher-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 right-0 left-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-8 transition-all duration-300">
      <div class="h-full flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-semibold text-slate-800 tracking-tight">Welcome back, <span class="text-indigo-600 font-black">{{ user()?.name }}</span></h2>
        </div>

        <div class="flex items-center gap-6">
          <!-- Chat/Message Icon -->
          <div class="relative group">
            <button (click)="chatService.isOpen.set(true)" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 focus:outline-none overflow-visible">
              <span class="material-icons text-2xl">forum</span>
              
              @if (chatService.unreadCount() > 0) {
                <span class="absolute -top-1 -right-1 flex h-6 w-6">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span class="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-rose-600 text-[10px] font-black text-white border-2 border-white shadow-sm">
                    {{ chatService.unreadCount() }}
                  </span>
                </span>
              }
            </button>
          </div>

          <!-- Notification Bell -->
          <div class="relative group">
            <button (click)="toggleNotifications()" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 focus:outline-none overflow-visible">
              <span class="material-icons text-2xl" [class.animate-wiggle]="pendingCount() > 0">notifications</span>
              
              @if (pendingCount() > 0) {
                <span class="absolute -top-1 -right-1 flex h-6 w-6">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span class="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-rose-600 text-[10px] font-black text-white border-2 border-white shadow-sm">
                    {{ pendingCount() }}
                  </span>
                </span>
              }
            </button>
            
            <!-- Notification Pop-up -->
            @if (showNotifications()) {
              <div class="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-50">
                <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-indigo-50/30">
                  <h3 class="text-base font-black text-slate-800 uppercase tracking-wider">Pending Inquiry Stream</h3>
                  <span class="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-lg">{{ pendingCount() }} New</span>
                </div>
                
                <div class="max-h-[32rem] overflow-y-auto hide-scrollbar">
                  @for (req of pendingRequests(); track req.id) {
                    <div class="p-5 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <div class="flex items-start gap-4 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                          {{ req.student_name?.charAt(0) }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-black text-slate-800 truncate">{{ req.student_name }}</p>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1 mt-0.5">Applied for: <span class="text-indigo-600">{{ req.course_name || req.course_subject }}</span></p>
                        </div>
                        <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{{ req.request_date | date:'shortTime' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button (click)="approve(req)" class="flex-1 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg hover:bg-emerald-700 transition-all">Accept</button>
                        <button (click)="reject(req.id)" class="flex-1 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg hover:bg-slate-200 transition-all">Decline</button>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-12 text-center">
                      <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <span class="material-icons text-3xl">done_all</span>
                      </div>
                      <p class="text-sm font-bold text-slate-800">No pending inquiries</p>
                      <p class="text-[10px] text-slate-400 font-medium mt-1">You're all caught up!</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="h-10 w-px bg-slate-100 mx-2"></div>

          <div class="hidden md:flex flex-col items-end">
            <span class="text-sm font-bold text-slate-900 leading-tight">{{ user()?.name }}</span>
            <span class="text-[11px] text-slate-500 font-medium lowercase tracking-wider opacity-60">{{ user()?.email }}</span>
          </div>
          <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-100 group cursor-pointer hover:scale-105 transition-transform duration-300">
             <img [src]="user()?.profile || 'https://ui-avatars.com/?name=' + user()?.name" class="h-full w-full object-cover rounded-[0.8rem] border border-white/20">
          </div>
        </div>
      </div>
    </header>

    <style>
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
      }
      .animate-wiggle {
        animation: wiggle 0.5s ease-in-out infinite;
      }
    </style>
  `
})
export class TeacherNavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private teacherService = inject(TeacherService);
  chatService = inject(ChatService);

  user = this.authService.currentUser;
  pendingCount = signal(0);
  pendingRequests = signal<any[]>([]);
  showNotifications = signal(false);

  ngOnInit() {
    this.loadPendingCount();
    // Poll for updates every 30 seconds
    setInterval(() => this.loadPendingCount(), 30000);
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
  }

  loadPendingCount() {
    const user = this.user();
    if (user) {
      this.teacherService.getPendingEnrollments(user.id).subscribe({
        next: (res: any) => {
          const requests = res.data || [];
          this.pendingRequests.set(requests);
          this.pendingCount.set(requests.length);
        }
      });
    }
  }

  approve(req: any) {
    const data = {
      student_id: req.student_id,
      course_id: req.course_id,
      teacher_id: req.teacher_id,
      enrollment_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    this.teacherService.approveEnrollment(req.id, data).subscribe(() => {
      this.loadPendingCount();
    });
  }

  reject(id: number) {
    this.teacherService.rejectEnrollment(id).subscribe(() => {
      this.loadPendingCount();
    });
  }
}
