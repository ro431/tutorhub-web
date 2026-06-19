import { Component, OnInit, signal, inject } from '@angular/core';
import { StudentService } from '../../../core/service/student.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DialogService } from '../../../core/service/dialog.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-enrollments',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">My Learning</h1>
        <p class="text-slate-500 font-medium">Track your enrollment requests and active courses</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Course Name</th>
              <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th class="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (req of requests(); track req.id) {
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-2xl bg-indigo-50 overflow-hidden border border-slate-100 group-hover:border-indigo-200 transition-all">
                      <img [src]="req.teacher_profile || 'https://ui-avatars.com/?name=' + req.teacher_name" 
                           class="w-full h-full object-cover">
                    </div>
                    <div>
                      <span class="font-black text-slate-800 block text-base">{{ req.course_name || req.subject }}</span>
                      <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Teacher: {{ req.teacher_name }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span [ngClass]="{
                    'bg-amber-100 text-amber-700 border-amber-200': req.status === 'pending',
                    'bg-emerald-100 text-emerald-700 border-emerald-200': req.status === 'approved' || req.status === 'accepted',
                    'bg-red-100 text-red-700 border-red-200': req.status === 'rejected'
                  }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
                    {{ req.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                  {{ (req.request_date || req.created_at) | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    @if (req.status === 'pending') {
                      <button (click)="cancel(req.id)" class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Cancel</button>
                    } @else if (req.status === 'approved' || req.status === 'accepted') {
                      <button (click)="leave(req.course_id)" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">Leave</button>
                    } @else if (req.status === 'rejected') {
                      <button (click)="retry(req.course_id)" class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Retry</button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        
        @if (requests().length === 0) {
          <div class="p-12 text-center">
            <div class="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 0.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332 0.477-4.5 1.253"></path></svg>
            </div>
            <p class="text-slate-400 font-medium">No active enrollments or requests found.</p>
            <button class="mt-4 text-indigo-600 font-bold hover:underline">Browse Courses</button>
          </div>
        }
      </div>
    </div>
  `
})
export class MyEnrollmentsComponent implements OnInit {
  private studentService = inject(StudentService);
  private toast = inject(ToastService);
  private dialog = inject(DialogService);

  requests = signal<any[]>([]);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.studentService.getRequests().subscribe({
      next: (res: any) => this.requests.set(res.data),
      error: () => this.toast.show('Failed to load courses', 'error')
    });
  }

  cancel(id: number) {
    this.dialog.confirm({
      title: 'Cancel Request?',
      message: 'Are you sure you want to cancel this enrollment request?',
      confirmText: 'Yes, Cancel',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.studentService.cancelRequest(id).subscribe({
          next: () => {
            this.toast.show('Request cancelled', 'success');
            this.loadRequests();
          },
          error: () => this.toast.show('Error cancelling request', 'error')
        });
      }
    });
  }

  leave(courseId: number) {
    this.dialog.confirm({
      title: 'Leave Course?',
      message: 'Are you sure you want to leave this course? You will need to request enrollment again to rejoin.',
      confirmText: 'Leave Course',
      type: 'danger'
    }).then(confirmed => {
      if (confirmed) {
        this.studentService.leaveCourse(courseId).subscribe({
          next: () => {
            this.toast.show('Left course successfully', 'success');
            this.loadRequests();
          },
          error: () => this.toast.show('Error leaving course', 'error')
        });
      }
    });
  }

  retry(courseId: number) {
    this.studentService.sendEnrollmentRequest(courseId).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.show('Enrollment request sent again!', 'success');
          this.loadRequests();
        } else {
          this.toast.show(res.msg || 'Request failed', 'error');
        }
      },
      error: (err) => this.toast.show(err.error?.msg || 'Failed to send request', 'error')
    });
  }
}
