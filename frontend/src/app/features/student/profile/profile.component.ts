import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../../core/service/student.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-student-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
        <p class="text-slate-500 font-medium">Manage your personal information and account settings</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Sidebar -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
            <div class="relative inline-block group mb-4">
              <div class="h-32 w-32 rounded-full bg-slate-100 border-4 border-indigo-500 p-1 overflow-hidden ring-8 ring-indigo-50 group-hover:scale-105 transition-transform duration-500">
                <img [src]="profileImage() || 'https://ui-avatars.com/api/?name=User'" class="h-full w-full object-cover rounded-full">
              </div>
              <label class="absolute bottom-0 right-0 h-10 w-10 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <input type="file" (change)="onFileSelected($event)" class="hidden">
              </label>
            </div>
            <h2 class="text-2xl font-black text-slate-800">{{ form.get('name')?.value }}</h2>
            <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Active Student</p>
          </div>
          
          <div class="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 italic font-medium">
            "Education is the most powerful weapon which you can use to change the world."
          </div>
        </div>

        <!-- Settings Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <form [formGroup]="form" (ngSubmit)="updateProfile()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" formControlName="name" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700">
                </div>
                
                <!-- Phone -->
                <div class="space-y-2">
                  <label class="block text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="text" formControlName="phone" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700">
                </div>
              </div>

              <!-- Email (Read-only for now) -->
              <div class="space-y-2">
                <label class="block text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Email (Read Only)</label>
                <input type="email" [value]="form.get('email')?.value" readonly class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed font-medium">
              </div>

              <div class="pt-6 flex gap-4">
                <button type="submit" [disabled]="isLoading()" class="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-70">
                  {{ isLoading() ? 'Saving Changes...' : 'Save My Profile' }}
                </button>
                <button type="button" (click)="resetForm()" class="px-8 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    form: FormGroup;
    isLoading = signal(false);
    profileImage = signal<string | null>(null);
    originalData: any = null;

    constructor(
        private fb: FormBuilder,
        private studentService: StudentService,
        private toast: ToastService
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: [{ value: '', disabled: true }],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            role: ['student'],
            profile: ['']
        });
    }

    ngOnInit() {
        this.studentService.getProfile().subscribe({
            next: (res: any) => {
                const data = res.data[0];
                this.originalData = data;
                this.form.patchValue(data);
                this.profileImage.set(data.profile);
            },
            error: () => this.toast.show('Failed to load profile', 'error')
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                this.profileImage.set(base64);
                this.form.patchValue({ profile: base64 });
            };
            reader.readAsDataURL(file);
        }
    }

    resetForm() {
        if (this.originalData) {
            this.form.patchValue(this.originalData);
            this.profileImage.set(this.originalData.profile);
        }
    }

    updateProfile() {
        if (this.form.invalid) {
            this.toast.show('Please fix the errors in the form', 'error');
            return;
        }

        this.isLoading.set(true);
        // We MUST include email in the payload because the user.controller.js mandates all fields 
        // (name, email, role, phone, profile) for updates to be successful.
        const payload = this.form.getRawValue();

        this.studentService.updateProfile(payload).subscribe({
            next: (res: any) => {
                this.isLoading.set(false);
                if (res.status) {
                    this.toast.show('Profile updated successfully!', 'success');
                    this.originalData = { ...this.originalData, ...payload };
                } else {
                    this.toast.show(res.msg || 'Update failed', 'error');
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                this.toast.show(err.error?.msg || 'An error occurred during update', 'error');
            }
        });
    }
}
