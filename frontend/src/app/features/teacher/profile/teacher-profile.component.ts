import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/service/teacher.service';
import { AuthService } from '../../../core/service/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 class="text-3xl font-black text-slate-800">My Profile</h1>
        <p class="text-slate-500 font-medium">Update your professional information and bio</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-slate-100 bg-slate-50/50">
          <div class="flex items-center gap-6">
            <div class="relative group">
              <div class="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 overflow-hidden border-4 border-white">
                <img *ngIf="profile().profile" [src]="profile().profile" class="h-full w-full object-cover">
                <span *ngIf="!profile().profile">{{ profile().name?.charAt(0) }}</span>
              </div>
              <label class="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-600 rounded-lg border-2 border-white flex items-center justify-center text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <input type="file" (change)="onFileSelected($event)" class="hidden">
              </label>
            </div>
            <div>
              <h2 class="text-2xl font-black text-slate-800">{{ profile().name }}</h2>
              <p class="text-slate-500 font-medium">{{ profile().email }}</p>
              <div class="mt-2 flex gap-2">
                <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Teacher</span>
                <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        </div>

        <form (ngSubmit)="updateProfile()" class="p-8 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input name="name" [(ngModel)]="profile().name" type="text"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-bold text-slate-700">
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <input name="phone" [(ngModel)]="profile().phone" type="text"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all font-bold text-slate-700">
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700 ml-1">Qualification</label>
              <input name="qualification" [(ngModel)]="profile().qualification" type="text" placeholder="e.g. M.Tech in CS"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all">
            </div>
            <div class="space-y-1">
              <label class="text-sm font-bold text-slate-700 ml-1">Experience (Years)</label>
              <input name="experience" [(ngModel)]="profile().experience_years" type="number"
                     class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-bold text-slate-700 ml-1">Professional Bio</label>
            <textarea name="bio" [(ngModel)]="profile().bio" rows="4" placeholder="Tell students about your teaching style and expertise..."
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all"></textarea>
          </div>

          <div class="pt-4 flex justify-end">
            <button type="submit" 
                    class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TeacherProfileComponent implements OnInit {
  private teacherService = inject(TeacherService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  profile = signal<any>({
    name: '',
    email: '',
    phone: '',
    profile: '',
    qualification: '',
    experience_years: 0,
    bio: ''
  });

  ngOnInit() {
    this.loadProfile();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.profile.update(p => ({ ...p, profile: base64 }));
      };
      reader.readAsDataURL(file);
    }
  }

  loadProfile() {
    const user = this.authService.currentUser();
    if (user) {
      this.teacherService.getProfile(user.id).subscribe({
        next: (res) => {
          if (res.data && res.data.length > 0) {
            this.profile.set({
              ...res.data[0],
              name: user.name,
              email: user.email,
              id: res.data[0].id, // This will be null if no profile row exists
              user_id: user.id
            });
          }
        },
        error: (err) => {
          if (err.status === 404) {
            console.log('Profile first time setup');
            this.profile.set({
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              profile: user.profile || '',
              qualification: '',
              experience_years: 0,
              bio: '',
              user_id: user.id
            });
          } else {
            this.toast.show('Error loading profile', 'error');
          }
        }
      });
    }
  }

  updateProfile() {
    const data = this.profile();
    const user = this.authService.currentUser();
    if (!user) return;

    // We use the user.id for the update API because the backend routes /profile/:id
    // expects the userId for the standard updateTeacherProfile logic we implemented
    this.teacherService.updateProfile(user.id, data).subscribe({
      next: () => {
        this.toast.show('Profile updated successfully!', 'success');
        this.loadProfile();
      },
      error: () => this.toast.show('Failed to update profile', 'error')
    });
  }
}
