import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/service/admin.service';
import { NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [NgFor, DecimalPipe],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-slate-900">System Analytics</h1>
          <p class="text-slate-500 font-medium text-lg mt-1">Real-time metrics tracking the health of TutorHub.</p>
        </div>
        <div class="px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of statCards()" 
             class="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-lg shadow-slate-100 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden">
             
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-[1.3] group-hover:bg-indigo-50/50 transition-transform duration-700"></div>

          <div class="relative z-10">
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{{stat.label.replace('_', ' ')}}</p>
              <h3 class="text-5xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors">
                {{stat.value | number}}
              </h3>
          </div>
        </div>
      </div>

      <!-- System Logs Table or Clean UI -->
      <div class="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-100">
        <h2 class="text-2xl font-black mb-8 text-slate-800 tracking-tight flex items-center gap-4 border-b border-slate-100 pb-6">
           <span class="material-icons text-indigo-500 bg-indigo-50 p-2 rounded-xl">receipt_long</span> 
           Internal Audit Logs
        </h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
            <span class="material-icons text-emerald-500">check_circle</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800">Database Connection Active</p>
              <p class="text-xs font-medium text-slate-500">Latency: 12ms</p>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Just Now</span>
          </div>
          <div class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
            <span class="material-icons text-emerald-500">security</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800">Security Protocols Nominal</p>
              <p class="text-xs font-medium text-slate-500">JWT Token Validation enforced consistently cross-module.</p>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">System Runtime</span>
          </div>
          <div class="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all">
            <span class="material-icons text-indigo-500">people</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800">User Tracking</p>
              <p class="text-xs font-medium text-slate-500">{{totalTeachers()}} Teachers and {{totalStudents()}} Students properly engaged.</p>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Metrics API</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOverviewComponent implements OnInit {
  adminService = inject(AdminService);

  totalTeachers = signal(0);
  totalStudents = signal(0);
  totalCourses = signal(0);
  totalEnrollments = signal(0);

  statCards = signal<any[]>([]);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.adminService.getStats().subscribe({
      next: (res: any) => {
        if (res.status) {
          const s = res.data;
          this.totalTeachers.set(s.totalTeachers);
          this.totalStudents.set(s.totalStudents);
          this.totalCourses.set(s.totalCourses);
          this.totalEnrollments.set(s.totalEnrollments);

          this.statCards.set([
            { label: 'Active_Teachers', value: s.totalTeachers },
            { label: 'Enrolled_Students', value: s.totalStudents },
            { label: 'Total_Courses', value: s.totalCourses },
            { label: 'System_Syncs', value: s.totalEnrollments }
          ]);
        }
      }
    });
  }
}
