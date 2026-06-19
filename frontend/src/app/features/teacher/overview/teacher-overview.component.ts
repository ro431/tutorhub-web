import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-teacher-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Welcome Header -->
      <div class="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div class="relative z-10">
          <h1 class="text-4xl font-black mb-2">Teacher Dashboard 👋</h1>
          <p class="text-indigo-100 text-lg max-w-xl">Manage your courses, respond to student enrollments, and track your teaching progress.</p>
        </div>
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-500 transition-colors">
          <div class="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 0.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332 0.477-4.5 1.253"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">Active Courses</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().courses }}</h3>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-emerald-500 transition-colors">
          <div class="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">Total Students</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().students }}</h3>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-amber-500 transition-colors">
          <div class="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">Pending Requests</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().pending }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8">
        <!-- Recent Notifications -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-800">Recent Notifications</h3>
            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">New Activity</span>
          </div>
          <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
            @for (n of notifications(); track n.id) {
              <div class="p-6 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div [class]="'w-12 h-12 rounded-xl flex items-center justify-center ' + getNotificationColor(n.status)">
                  <span class="material-icons text-xl">{{ getNotificationIcon(n.status) }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-slate-800">
                    <span class="text-indigo-600 font-bold">{{ n.student_name }}</span> 
                    {{ getNotificationText(n.status) }} 
                    <span class="text-indigo-600 font-bold">{{ n.course_name }}</span>
                  </p>
                  <p class="text-xs text-slate-400 mt-1 font-medium">{{ n.request_date | date:'medium' }}</p>
                </div>
              </div>
            } @empty {
              <div class="p-12 text-center">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <span class="material-icons text-3xl">notifications_off</span>
                </div>
                <p class="text-slate-500 font-medium">No recent notifications</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

  <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  </style>
  `
})
export class TeacherOverviewComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);

  stats = signal({ courses: 0, students: 0, pending: 0 });
  notifications = signal<any[]>([]);

  ngOnInit() {
    this.loadStats();
    this.loadNotifications();
  }

  loadStats() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getCoursesByTeacher(user.id).subscribe(res => {
        const courses = res.data || [];
        this.stats.update(s => ({ ...s, courses: courses.length }));
      });
      this.teacherService.getPendingEnrollments(user.id).subscribe(res => {
        const pending = res.data || [];
        this.stats.update(s => ({ ...s, pending: pending.length }));
      });
      // Still load student count for the stats card
      this.teacherService.getEnrolledStudents(user.id).subscribe(res => {
        const students = res.data || [];
        this.stats.update(s => ({ ...s, students: students.length }));
      });
    }
  }

  loadNotifications() {
    this.teacherService.getNotifications().subscribe(res => {
      this.notifications.set(res.data || []);
    });
  }

  getNotificationIcon(status: string) {
    switch (status) {
      case 'pending': return 'person_add';
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      default: return 'info';
    }
  }

  getNotificationColor(status: string) {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'approved': return 'bg-emerald-50 text-emerald-600';
      case 'rejected': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  }

  getNotificationText(status: string) {
    switch (status) {
      case 'pending': return 'requested to enroll in';
      case 'approved': return 'is successfully enrolled in';
      case 'rejected': return 'enrollment was declined for';
      default: return 'activity on';
    }
  }
}
