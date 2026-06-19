import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { StudentService } from '../../../core/service/student.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Discover Courses</h1>
          <p class="text-slate-500 font-medium">Explore and enroll in courses taught by expert teachers</p>
        </div>
        <div class="flex gap-2">
          <input type="text" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" placeholder="Search courses..." class="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (course of filteredCourses(); track course.id) {
          <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all group">
            <div class="h-48 bg-slate-100 relative overflow-hidden">
              <img [src]="'https://picsum.photos/seed/' + (course.name || course.subject) + '/800/400'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Course Cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <span class="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{{ course.category || 'General' }}</span>
                <h3 class="text-white font-bold text-xl mt-1 leading-tight">{{ course.name }}</h3>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <p class="text-slate-600 text-sm line-clamp-2">{{ course.description }}</p>
              
              <div class="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{{ course.duration || '8 Weeks' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <span>{{ course.capacity || '30' }} Slots</span>
                </div>
              </div>

              <!-- Teacher Info -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 overflow-hidden border border-slate-100">
                  <img [src]="course.teacher_profile || 'https://ui-avatars.com/?name=' + course.teacher_name" 
                       class="w-full h-full object-cover">
                </div>
                <div>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter block leading-none">Instructor</span>
                  <span class="text-sm font-bold text-slate-700">{{ course.teacher_name }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div class="text-slate-900 font-black text-2xl">
                  ₹{{ course.fee || course.price || '0' }}
                </div>
                
                @if (course.enrollment_status === 'pending') {
                  <button class="px-6 py-2 bg-amber-50 text-amber-600 font-bold rounded-xl cursor-default border border-amber-100 flex items-center gap-2">
                    <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Pending
                  </button>
                } @else if (course.enrollment_status === 'approved') {
                  <button class="px-6 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl cursor-default border border-emerald-100 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Enrolled
                  </button>
                } @else {
                  <button (click)="enroll(course.id)" class="px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100">
                    {{ course.enrollment_status === 'rejected' ? 'Try Again' : 'Enroll Now' }}
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CourseCatalogComponent implements OnInit {
  private studentService = inject(StudentService);
  private toast = inject(ToastService);

  courses = signal<any[]>([]);
  searchQuery = signal('');

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.courses();
    return this.courses().filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.subject?.toLowerCase().includes(q) || 
      c.teacher_name?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.studentService.getAvailableCourses().subscribe({
      next: (res: any) => this.courses.set(res.data),
      error: () => this.toast.show('Failed to load courses', 'error')
    });
  }

  enroll(courseId: number) {
    this.studentService.sendEnrollmentRequest(courseId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show('Enrollment request sent successfully!', 'success');
        } else {
          this.toast.show(res.msg || 'Request failed', 'error');
        }
      },
      error: (err: any) => this.toast.show(err.error?.msg || 'Failed to send request', 'error')
    });
  }
}
