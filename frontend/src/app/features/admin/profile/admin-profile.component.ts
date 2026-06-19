import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../core/service/admin.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AuthService } from '../../../core/service/auth.service';
@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl animate-in fade-in zoom-in duration-500">
      <h1 class="text-4xl font-black text-slate-800 tracking-tight mb-8">System Configuration</h1>

      <div class="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-xl shadow-slate-100 relative overflow-hidden group">
        <!-- Abstract Decoration -->
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

        <h2 class="relative z-10 text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <span class="w-3 h-3 bg-indigo-500 rounded-full"></span> 
          Update Credentials
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 relative z-10">
          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Admin Email</label>
            <input type="email" formControlName="email" 
                   class="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all">
          </div>

          <div class="space-y-2">
            <label class="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">New Master Password</label>
            <input type="password" formControlName="password" placeholder="Leave blank to keep current"
                   class="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all">
          </div>

          <div class="pt-6">
            <button type="submit" [disabled]="isLoading()"
                    class="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200 transition-all disabled:opacity-50">
              @if (isLoading()) {
                Committing Changes...
              } @else {
                Sync Configuration
              }
            </button>
          </div>
        </form>
      </div>
      
      <div class="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-4">
        <span class="material-icons text-rose-500 mt-1">warning</span>
        <p class="text-xs text-rose-700 font-bold leading-relaxed">
          Warning: Changing root credentials may cause temporary de-sync. 
          Ensure new credentials are securely stored in your vault.
        </p>
      </div>
    </div>
  `
})
export class AdminProfileComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  isLoading = signal(false);
  form: FormGroup;

  constructor() {
    const user = this.auth.currentUser();
    this.form = this.fb.group({
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const data = { ...this.form.value };
    if (!data.password) delete data.password;

    this.adminService.updateProfile(data).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res.status) {
          this.toast.show('Credentials updated successfully', 'success');
          // Optionally update local storage if email changed
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.email = data.email;
          localStorage.setItem('user', JSON.stringify(user));
          this.auth.checkAuth();
        } else {
          this.toast.show(res.msg || 'Update failed', 'error');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.show(err.error?.msg || 'Update failed', 'error');
      }
    });
  }
}
