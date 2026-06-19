import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/service/admin.service';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-enrollments',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">System Enrollments</h1>
        <p class="text-slate-500 font-medium text-lg mt-1">Holistic view of all active network links.</p>
      </div>
      
      <div class="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
          <span>Global Access Point</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-white text-slate-400 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
              <tr>
                <th class="px-8 py-5">Student Learner</th>
                <th class="px-8 py-5">Email Handle</th>
                <th class="px-8 py-5">Course Expert</th>
                <th class="px-8 py-5">Target Course</th>
                <th class="px-8 py-5">System State</th>
                <th class="px-8 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let s of enrollments()" class="hover:bg-slate-50 transition-colors group">
                <td class="px-8 py-5 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 border border-slate-100">
                    <img [src]="s.student_profile || 'https://ui-avatars.com/?name=' + s.student_name + '&background=ecfdf5&color=059669'" 
                         class="w-full h-full object-cover">
                  </div>
                  <span class="font-bold text-slate-800">{{s.student_name}}</span>
                </td>
                <td class="px-8 py-5 text-xs font-bold text-slate-400">{{s.student_email}}</td>
                <td class="px-8 py-5 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 border border-slate-100">
                    <img [src]="s.teacher_profile || 'https://ui-avatars.com/?name=' + s.teacher_name + '&background=eef2ff&color=4f46e5'" 
                         class="w-full h-full object-cover">
                  </div>
                  <span class="font-bold text-slate-800">{{s.teacher_name}}</span>
                </td>
                <td class="px-8 py-5 font-black text-slate-600">{{s.course_name}}</td>
                <td class="px-8 py-5">
                  <span class="px-3 py-1 rounded-full text-[10px] uppercase font-black" 
                        [style.background-color]="s.status === 'approved' ? '#ecfdf5' : '#fef2f2'"
                        [style.color]="s.status === 'approved' ? '#059669' : '#e11d48'">
                    {{s.status}}
                  </span>
                </td>
                <td class="px-8 py-5 text-right text-xs font-bold text-slate-500">{{s.enrollment_date | date:'short'}}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="enrollments().length === 0" class="p-16 text-center text-slate-400 font-bold">
            No synchronization paths registered.
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminEnrollmentsComponent implements OnInit {
  adminService = inject(AdminService);
  enrollments = signal<any[]>([]);

  ngOnInit() {
    this.adminService.getEnrollments().subscribe((res: any) => {
      if (res.status) {
        this.enrollments.set(res.data);
      }
    });
  }
}
