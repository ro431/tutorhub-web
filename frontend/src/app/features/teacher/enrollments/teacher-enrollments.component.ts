import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-teacher-enrollments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Active Inquiries</h1>
          <p class="text-slate-500 font-medium text-lg mt-1">Curate your student roster and manage incoming applications</p>
        </div>
        <div class="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sm">
          <div class="text-right">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Volume</p>
            <p class="text-xl font-black text-indigo-600 leading-none">{{ requests().length }} Applications</p>
          </div>
          <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <span class="material-icons">pending_actions</span>
          </div>
        </div>
      </div>

      <!-- Requests Container -->
      <div class="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/30">
                <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Prospect Profile</th>
                <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Course</th>
                <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Applied On</th>
                <th class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Decision</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (req of requests(); track req.id; let i = $index) {
                <tr [style.animation-delay]="i * 75 + 'ms'"
                    class="hover:bg-indigo-50/30 transition-all duration-300 group animate-in fade-in slide-in-from-left-4 fill-mode-both">
                  <td class="px-8 py-8">
                    <div class="flex items-center gap-5">
                      <div class="relative">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                          {{ req.student_name?.charAt(0) }}
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p class="text-base font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{{ req.student_name }}</p>
                        <p class="text-xs font-bold text-slate-400 mt-1">{{ req.student_email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-8">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-indigo-100 group-hover:bg-white transition-all">
                      <span class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                      <span class="text-xs font-black text-slate-700 uppercase tracking-wider">{{ req.course_name || req.course_subject }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-8">
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-slate-700">{{ req.request_date | date:'MMMM d' }}</span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ req.request_date | date:'shortTime' }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-8 text-right">
                    <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <button (click)="approve(req)" 
                              class="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-[11px] font-black rounded-xl hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-100 hover:-translate-y-0.5 transition-all shadow-sm">
                        <span class="material-icons text-sm">check_circle</span>
                        Accept
                      </button>
                      <button (click)="reject(req.id)" 
                              class="flex items-center gap-2 px-6 py-3 bg-white border border-rose-100 text-rose-500 text-[11px] font-black rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all">
                        <span class="material-icons text-sm">block</span>
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr class="animate-in fade-in duration-700">
                  <td colspan="4" class="px-8 py-24 text-center">
                    <div class="relative w-24 h-24 mx-auto mb-8">
                      <div class="absolute inset-0 bg-indigo-50 rounded-[2rem] rotate-6 animate-pulse"></div>
                      <div class="relative w-24 h-24 bg-white rounded-[2rem] border border-indigo-50 flex items-center justify-center text-slate-300">
                        <span class="material-icons text-4xl">inventory_2</span>
                      </div>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 mb-2 tracking-tight">System Status: Cleared</h3>
                    <p class="text-slate-400 font-medium max-w-sm mx-auto">All applications have been processed. You're fully caught up with your prospective students.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TeacherEnrollmentsComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);

  requests = signal<any[]>([]);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getPendingEnrollments(user.id).subscribe(res => {
        this.requests.set(res.data || []);
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
      this.loadRequests();
    });
  }

  reject(id: number) {
    if (confirm('Are you sure you want to decline this enrollment?')) {
      this.teacherService.rejectEnrollment(id).subscribe(() => {
        this.loadRequests();
      });
    }
  }
}
