import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LiveClassService } from '../../../core/service/live-class.service';
import { TeacherService } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DialogService } from '../../../core/service/dialog.service';

@Component({
  selector: 'app-teacher-live-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Live Classes</h1>
          <p class="text-slate-500 font-medium">Schedule and manage your interactive live sessions</p>
        </div>
        <button (click)="showForm.set(true)" 
                class="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
          <span class="material-icons text-sm">add</span>
          Schedule Class
        </button>
      </div>

      <!-- Schedule Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 class="text-xl font-black text-slate-800">Schedule Live Session</h2>
              <button (click)="showForm.set(false)" class="text-slate-400 hover:text-slate-600 transition-colors">
                <span class="material-icons">close</span>
              </button>
            </div>
            
            <form (submit)="schedule()" class="p-8 space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Course</label>
                <select [(ngModel)]="newClass().course_id" name="course_id" class="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 appearance-none font-bold text-slate-700">
                  <option value="0" disabled>Select Course</option>
                  @for (course of courses(); track course.id) {
                    <option [value]="course.id">{{ course.name || course.subject }}</option>
                  }
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Session Title</label>
                <input [(ngModel)]="newClass().title" name="title" type="text" placeholder="e.g. Introduction to Calculus" class="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Start Time</label>
                  <input [(ngModel)]="newClass().start_time" name="start_time" type="datetime-local" class="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700">
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Meeting Link</label>
                  <input [(ngModel)]="newClass().meeting_link" name="meeting_link" type="url" placeholder="zoom.us/..." class="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 font-bold text-slate-700">
                </div>
              </div>

              <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-indigo-100 mt-4">
                Confirm Schedule
              </button>
            </form>
          </div>
        </div>
      }

      <!-- Sessions List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (session of sessions(); track session.id) {
          <div class="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between hover:shadow-xl transition-all group">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <span class="material-icons text-3xl">video_camera_front</span>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] font-black text-white bg-indigo-500 px-2 py-0.5 rounded-full uppercase tracking-widest">{{ session.course_name }}</span>
                  <span [ngClass]="{
                    'bg-amber-100 text-amber-600': session.status === 'scheduled',
                    'bg-emerald-100 text-emerald-600': session.status === 'ongoing',
                    'bg-slate-100 text-slate-500': session.status === 'completed'
                  }" class="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-current/10">
                    {{ session.status }}
                  </span>
                </div>
                <h3 class="font-black text-slate-800 text-lg leading-tight">{{ session.title }}</h3>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{{ session.start_time | date:'medium' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              @if (session.status === 'scheduled') {
                <button (click)="updateStatus(session.id, 'ongoing')" class="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                  <span class="material-icons text-sm">play_arrow</span>
                </button>
              } @else if (session.status === 'ongoing') {
                <button (click)="updateStatus(session.id, 'completed')" class="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-800 hover:text-white transition-all">
                  <span class="material-icons text-sm">stop</span>
                </button>
              }
              <button (click)="deleteSession(session.id)" class="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <span class="material-icons text-3xl">videocam_off</span>
            </div>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No live sessions scheduled yet</p>
          </div>
        }
      </div>
    </div>
  `
})
export class TeacherLiveClassesComponent implements OnInit {
  private liveClassService = inject(LiveClassService);
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private dialog = inject(DialogService);

  sessions = signal<any[]>([]);
  courses = signal<any[]>([]);
  showForm = signal(false);
  newClass = signal<any>({
    course_id: 0,
    title: '',
    meeting_link: '',
    start_time: ''
  });

  ngOnInit() {
    this.loadSessions();
    this.loadCourses();
  }

  loadSessions() {
    this.liveClassService.getTeacherLiveClasses().subscribe({
      next: (res: any) => this.sessions.set(res.data || [])
    });
  }

  loadCourses() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getCoursesByTeacher(user.id).subscribe({
        next: (res: any) => this.courses.set(res.data || [])
      });
    }
  }

  schedule() {
    if (this.newClass().course_id === 0 || !this.newClass().title || !this.newClass().meeting_link || !this.newClass().start_time) {
      this.toast.show('Please fill all fields', 'error');
      return;
    }

    this.liveClassService.scheduleLiveClass(this.newClass()).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show('Live class scheduled!', 'success');
          this.showForm.set(false);
          this.loadSessions();
        }
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.liveClassService.updateStatus(id, status).subscribe({
      next: () => {
        this.toast.show(`Class ${status}!`, 'success');
        this.loadSessions();
      }
    });
  }

  deleteSession(id: number) {
    this.dialog.confirm({
      title: 'Delete Session?',
      message: 'Are you sure you want to delete this live class? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.liveClassService.deleteLiveClass(id).subscribe({
          next: () => {
            this.toast.show('Session deleted', 'success');
            this.loadSessions();
          }
        });
      }
    });
  }
}
