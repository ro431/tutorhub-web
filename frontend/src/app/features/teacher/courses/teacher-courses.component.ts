import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService, Course } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DialogService } from '../../../core/service/dialog.service';

@Component({
  selector: 'app-teacher-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">My Courses</h1>
          <p class="text-slate-500 font-medium text-lg mt-1">Design and manage your premium learning experiences</p>
        </div>
        <button (click)="openModal()" 
                class="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:-translate-y-1 hover:bg-indigo-700 transition-all active:scale-95 group">
          <span class="material-icons group-hover:rotate-90 transition-transform duration-300">add</span>
          Create New Course
        </button>
      </div>

      <!-- Course Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        @for (course of courses(); track course.id; let i = $index) {
          <div [style.animation-delay]="i * 100 + 'ms'"
               class="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden group hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 flex flex-col animate-in fade-in zoom-in-95 fill-mode-both">
            
            <div class="p-8 flex-1">
              <div class="flex items-center justify-between mb-6">
                <span class="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-black rounded-full uppercase tracking-widest border border-indigo-100/50">
                  {{ course.mode }}
                </span>
                <div class="flex flex-col items-end">
                  <span class="text-2xl font-black text-slate-800">₹{{ course.fee || course.price }}</span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Course Fee</span>
                </div>
              </div>

              <h3 class="text-2xl font-black text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">{{ course.subject }}</h3>
              <p class="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">{{ course.description }}</p>
              
              <div class="flex items-center gap-4 py-4 border-t border-slate-50">
                <div class="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                  <span class="material-icons text-indigo-400 text-sm">calendar_today</span>
                  <span class="text-[11px] font-bold text-slate-600">{{ course.start_date | date:'MMM d' }} - {{ course.end_date | date:'MMM d, y' }}</span>
                </div>
              </div>
            </div>
            
            <div class="p-8 bg-gradient-to-br from-slate-50/50 to-white border-t border-slate-50 flex items-center justify-between gap-3">
              <button (click)="editCourse(course)" 
                      class="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm">
                Edit Experience
              </button>
              <button (click)="deleteCourse(course.id!)" 
                      class="px-5 py-3.5 bg-rose-50 text-rose-600 text-xs font-black rounded-2xl hover:bg-rose-100 transition-all group/del">
                <span class="material-icons text-xl group-hover:scale-110 transition-transform">delete</span>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full p-20 text-center bg-white/50 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200">
            <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
              <span class="material-icons text-5xl">auto_stories</span>
            </div>
            <h3 class="text-2xl font-black text-slate-800 mb-2">No educational journeys yet</h3>
            <p class="text-slate-400 font-medium">Create your first premium course and start inspiring students</p>
          </div>
        }
      </div>

      <!-- Course Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div class="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div class="p-10 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div>
                <h2 class="text-3xl font-black text-slate-800 tracking-tight">{{ isEdit() ? 'Edit Course' : 'Create New Journey' }}</h2>
                <p class="text-slate-400 text-sm font-medium mt-1">Fill in the details for your premium content</p>
              </div>
              <button (click)="closeModal()" class="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                <span class="material-icons">close</span>
              </button>
            </div>
            
            <form (ngSubmit)="saveCourse()" class="p-10 space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Name</label>
                  <input name="subject" [(ngModel)]="currentCourse.subject" type="text" placeholder="e.g. Mastery of UI Design"
                         class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800">
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Course Fee (₹)</label>
                  <input name="fee" [(ngModel)]="currentCourse.fee" type="number"
                         class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800">
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Learning Mode</label>
                  <select name="mode" [(ngModel)]="currentCourse.mode"
                          class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800">
                    <option value="online">Online Live</option>
                    <option value="offline">In-Person</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                  <input name="start_date" [(ngModel)]="currentCourse.start_date" type="date"
                         class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800">
                </div>
                <div class="space-y-2 lg:col-span-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                  <input name="end_date" [(ngModel)]="currentCourse.end_date" type="date"
                         class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800">
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Experience Hook (Short Bio)</label>
                <textarea name="description" [(ngModel)]="currentCourse.description" rows="2" placeholder="Catch student interest in 2 lines..."
                          class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800"></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Journey Map (Full Syllabus / Notes)</label>
                <textarea name="content" [(ngModel)]="currentCourse.content" rows="4" placeholder="Deep dive into what students will achieve..."
                          class="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all font-bold text-slate-800"></textarea>
              </div>

              <div class="flex items-center gap-4 pt-6">
                <button type="button" (click)="closeModal()" 
                        class="flex-1 px-8 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
                  Dismiss
                </button>
                <button type="submit" 
                        class="flex-[2] px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50">
                  {{ isEdit() ? 'Persist Changes' : 'Initialize Journey' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `
})
export class TeacherCoursesComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private dialog = inject(DialogService);

  courses = signal<any[]>([]);
  showModal = signal(false);
  isEdit = signal(false);

  initialCourse: Course = {
    teacher_id: 0,
    subject: '',
    description: '',
    content: '',
    fee: 0,
    mode: 'online',
    start_date: '',
    end_date: ''
  };

  currentCourse: Course = { ...this.initialCourse };

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getCoursesByTeacher(user.id).subscribe({
        next: (res) => this.courses.set(res.data || []),
        error: (err) => this.toast.show('Failed to load courses', 'error')
      });
    }
  }

  openModal() {
    const user = this.authService.currentUser();
    this.currentCourse = { ...this.initialCourse, teacher_id: user?.id || 0 };
    this.isEdit.set(false);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  editCourse(course: any) {
    this.currentCourse = { ...course };
    // Format dates for input[type="date"]
    if (this.currentCourse.start_date) this.currentCourse.start_date = this.currentCourse.start_date.split('T')[0];
    if (this.currentCourse.end_date) this.currentCourse.end_date = this.currentCourse.end_date.split('T')[0];
    this.isEdit.set(true);
    this.showModal.set(true);
  }

  saveCourse() {
    if (this.isEdit()) {
      this.teacherService.updateCourse(this.currentCourse.id!, this.currentCourse).subscribe({
        next: () => {
          this.toast.show('Course updated successfully!', 'success');
          this.loadCourses();
          this.closeModal();
        },
        error: (err) => this.toast.show(err.error?.msg || 'Failed to update course', 'error')
      });
    } else {
      this.teacherService.createCourse(this.currentCourse).subscribe({
        next: () => {
          this.toast.show('Course created successfully!', 'success');
          this.loadCourses();
          this.closeModal();
        },
        error: (err) => this.toast.show(err.error?.msg || 'Failed to create course', 'error')
      });
    }
  }

  deleteCourse(id: number) {
    this.dialog.confirm({
      title: 'Terminate Journey?',
      message: 'This action is permanent. All course content and student connections will be severed instantly.',
      confirmText: 'Confirm Termination',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.teacherService.deleteCourse(id).subscribe({
          next: () => {
            this.toast.show('Educational journey terminated', 'success');
            this.loadCourses();
          },
          error: (err) => this.toast.show('Failed to delete course', 'error')
        });
      }
    });
  }
}
