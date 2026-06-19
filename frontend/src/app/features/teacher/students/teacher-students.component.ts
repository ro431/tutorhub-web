import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';
import { DialogService } from '../../../core/service/dialog.service';

@Component({
  selector: 'app-teacher-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-800">My Registered Students</h1>
          <p class="text-slate-500 font-medium mt-1">Manage your enrolled students and their subjects.</p>
        </div>
        <div class="px-6 py-2 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100">
          {{ students().length }} Students
        </div>
      </div>

      <!-- Students Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (student of students(); track student.id) {
          <div class="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group relative overflow-hidden">
            <!-- Decorative Background Element -->
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform duration-500">
                  {{ student.student_name?.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-black text-slate-800 truncate text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{{ student.student_name }}</h4>
                    @if (isOnline(student.last_seen)) {
                        <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    }
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{{ student.student_email }}</p>
                    <span [class]="'px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ' + getStatusColor(student.last_seen)">
                      {{ getStatus(student.last_seen) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div class="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span class="text-slate-400 uppercase tracking-wider">Course / Subject</span>
                  </div>
                  <p class="text-indigo-600 font-black text-sm">{{ student.course_name || student.course_subject }}</p>
                </div>
                
                <div class="flex items-center justify-between px-2">
                  <div class="flex flex-col">
                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Enrolled On</span>
                    <span class="text-[11px] font-bold text-slate-600">{{ student.enrollment_date | date:'mediumDate' }}</span>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                    <span class="material-icons text-sm">verified</span>
                  </div>
                </div>
              </div>

              <button (click)="openRemoveModal(student)" 
                      class="w-full py-3.5 bg-white border-2 border-slate-100 text-rose-500 text-[11px] font-black rounded-2xl hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group/btn active:scale-95">
                <span class="material-icons text-lg group-hover/btn:rotate-12 transition-transform duration-300">person_remove</span>
                Unenroll Student
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
            <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
              <span class="material-icons text-5xl">people_outline</span>
            </div>
            <h4 class="text-xl font-black text-slate-800">No students enrolled yet</h4>
            <p class="text-slate-500 font-medium mt-3 max-w-sm mx-auto px-6">Available courses will appear here once students apply and you accept their requests.</p>
          </div>
        }
      </div>

    </div>
  `
})
export class TeacherStudentsComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private dialog = inject(DialogService);

  students = signal<any[]>([]);

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getEnrolledStudents(user.id).subscribe(res => {
        this.students.set(res.data || []);
      });
    }
  }

  openRemoveModal(student: any) {
    this.dialog.confirm({
      title: 'Confirm Unenrollment?',
      message: `Are you sure you want to remove ${student.student_name} from "${student.course_name || student.course_subject}"? This action cannot be undone.`,
      confirmText: 'Remove Now',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.teacherService.unenrollStudent(student.id).subscribe(() => {
          this.loadStudents();
        });
      }
    });
  }

  getStatus(lastSeen: string | null): string {
    if (!lastSeen) return 'Offline';
    const now = new Date();
    const last = new Date(lastSeen);
    const diffInMins = Math.floor((now.getTime() - last.getTime()) / 60000);

    if (diffInMins < 5) return 'Online';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`;
    return `${Math.floor(diffInMins / 1440)}d ago`;
  }

  getStatusColor(lastSeen: string | null): string {
    if (!lastSeen) return 'text-slate-400 bg-slate-100';
    const now = new Date();
    const last = new Date(lastSeen);
    const diffInMins = Math.floor((now.getTime() - last.getTime()) / 60000);

    if (diffInMins < 5) return 'text-emerald-600 bg-emerald-50';
    return 'text-slate-400 bg-slate-100';
  }

  isOnline(lastSeen: string | null): boolean {
    if (!lastSeen) return false;
    const now = new Date();
    const last = new Date(lastSeen);
    const diffInMins = Math.floor((now.getTime() - last.getTime()) / 60000);
    return diffInMins < 5;
  }
}
