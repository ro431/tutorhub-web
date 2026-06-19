import { Component, OnInit, signal } from '@angular/core';
import { StudentService } from '../../../core/service/student.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Welcome Header -->
      <div class="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div class="relative z-10">
          <h1 class="text-4xl font-black mb-2">Welcome back, {{ student()?.name || 'Student' }}! 👋</h1>
          <p class="text-indigo-100 text-lg max-w-xl">You have 3 active enrollments and 1 pending request. Ready to learn something new today?</p>
          <button class="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all active:translate-y-0">
            Continue Learning
          </button>
        </div>
        <!-- Decorative Circle -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-500 transition-colors">
          <div class="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 0.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332 0.477-4.5 1.253"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">Available Courses</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().availableCourses }}</h3>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-emerald-500 transition-colors">
          <div class="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">My Enrollments</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().enrollments }}</h3>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-amber-500 transition-colors">
          <div class="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-slate-500 font-medium">Pending Requests</p>
          <h3 class="text-2xl font-black text-slate-800">{{ stats().pendingRequests }}</h3>
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent implements OnInit {
    student = signal<any>(null);
    stats = signal({ availableCourses: 0, enrollments: 0, pendingRequests: 0 });

    constructor(private studentService: StudentService) { }

    ngOnInit() {
        this.studentService.getProfile().subscribe({
            next: (res: any) => this.student.set(res.data[0]),
            error: () => console.log('Error fetching overview profile')
        });

        // Load correct stats dynamically:
        this.studentService.getAvailableCourses().subscribe({
            next: (res: any) => this.stats.update(s => ({ ...s, availableCourses: res.data?.length || 0 }))
        });
        
        this.studentService.getEnrollments().subscribe({
            next: (res: any) => {
                const data = res.data || [];
                const active = data.filter((e: any) => e.status === 'approved').length;
                const pending = data.filter((e: any) => e.status === 'pending').length;
                this.stats.update(s => ({ ...s, enrollments: active, pendingRequests: pending }));
            }
        });
    }
}
