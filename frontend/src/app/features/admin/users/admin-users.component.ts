import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/service/admin.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { DialogService } from '../../../core/service/dialog.service';
import { NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgFor, DatePipe],
  template: `
    <div class="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">User Database</h1>
        <p class="text-slate-500 font-medium text-lg mt-1">Manage platform participants across all modules.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Teachers List -->
        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 class="text-xl font-black text-slate-800">Active Teachers</h2>
            <div class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{teachers().length}} Total
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white text-slate-400 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-4">Name</th>
                  <th class="px-6 py-4">Email</th>
                  <th class="px-6 py-4">Joined</th>
                  <th class="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let t of teachers()" class="hover:bg-slate-50 transition-colors group">
                  <td class="px-6 py-4 flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 border border-slate-100 group-hover:border-indigo-200 transition-all shadow-sm">
                      <img [src]="t.profile || 'https://ui-avatars.com/?name=' + t.name + '&background=eef2ff&color=4f46e5'" 
                           class="w-full h-full object-cover">
                    </div>
                    <span class="font-bold text-slate-700">{{t.name}}</span>
                  </td>
                  <td class="px-6 py-4 text-xs font-bold text-slate-400">{{t.email}}</td>
                  <td class="px-6 py-4 text-xs font-bold text-slate-500">{{t.created_at | date:'shortDate'}}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="deleteUser(t)" class="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <span class="material-icons text-sm">delete_sweep</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Students List -->
        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 class="text-xl font-black text-slate-800">Active Students</h2>
            <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{students().length}} Total
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white text-slate-400 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                <tr>
                  <th class="px-6 py-4">Name</th>
                  <th class="px-6 py-4">Email</th>
                  <th class="px-6 py-4">Joined</th>
                  <th class="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let s of students()" class="hover:bg-slate-50 transition-colors group">
                  <td class="px-6 py-4 flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 border border-slate-100 group-hover:border-emerald-200 transition-all shadow-sm">
                      <img [src]="s.profile || 'https://ui-avatars.com/?name=' + s.name + '&background=ecfdf5&color=059669'" 
                           class="w-full h-full object-cover">
                    </div>
                    <span class="font-bold text-slate-700">{{s.name}}</span>
                  </td>
                  <td class="px-6 py-4 text-xs font-bold text-slate-400">{{s.email}}</td>
                  <td class="px-6 py-4 text-xs font-bold text-slate-500">{{s.created_at | date:'shortDate'}}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="deleteUser(s)" class="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <span class="material-icons text-sm">delete_sweep</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  adminService = inject(AdminService);
  toastService = inject(ToastService);
  dialogService = inject(DialogService);

  teachers = signal<any[]>([]);
  students = signal<any[]>([]);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getTeachers().subscribe((res: any) => {
      if (res.status) this.teachers.set(res.data);
    });
    this.adminService.getStudents().subscribe((res: any) => {
      if (res.status) this.students.set(res.data);
    });
  }

  async deleteUser(user: any) {
    const confirmed = await this.dialogService.confirm({
      title: 'TERMINATE_USER',
      message: `Are you sure you want to permanently delete ${user.name}? All related records (courses, profiles, enrollments) will be lost.`,
      confirmText: 'DELETE_PERMANENTLY'
    });

    if (confirmed) {
      this.adminService.deleteUser(user.id).subscribe({
        next: (res: any) => {
          if (res.status) {
            this.toastService.show('USER_ERASED', 'success');
            this.loadUsers();
          }
        },
        error: (err) => {
          this.toastService.show(err.error.msg || 'TERMINATION_FAILED', 'error');
        }
      });
    }
  }
}
