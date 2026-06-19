import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/service/student.service';
import { ChatService } from '../../../core/service/chat.service';

@Component({
    selector: 'app-my-teachers',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-800 tracking-tight mb-2">My <span class="text-indigo-600">Teachers</span></h1>
          <p class="text-slate-500 font-medium tracking-wide uppercase text-xs">Expert educators guiding your journey</p>
        </div>
        <div class="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          <span class="text-indigo-700 text-xs font-black uppercase tracking-widest">{{ teachers().length }} Connected</span>
        </div>
      </div>

      <!-- Teachers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (teacher of teachers(); track teacher.id) {
          <div class="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 border-b-4 border-b-indigo-500/20 hover:border-b-indigo-500 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            
            <!-- Dynamic Background Ornament -->
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <div class="relative">
                  <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform duration-500">
                    <img [src]="teacher.profile || 'https://ui-avatars.com/?name=' + teacher.name" 
                         class="w-full h-full object-cover rounded-[1.2rem] border-2 border-white">
                  </div>
                  <!-- Status Indicator -->
                  @if (isOnline(teacher.last_seen)) {
                    <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center animate-bounce">
                        <div class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  }
                </div>
                <div class="flex flex-col items-end">
                   <span class="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Teacher ID: #{{teacher.id}}</span>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{{ teacher.name }}</h3>
                <p class="text-slate-400 text-sm font-medium">{{ teacher.email }}</p>
                <div class="mt-4 flex items-center gap-2">
                    <span class="material-icons text-indigo-400 text-sm">schedule</span>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ getStatus(teacher.last_seen) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-3 pt-4">
                <button (click)="openChat(teacher)" 
                        class="flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-2xl py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 group/btn">
                  <span class="material-icons text-sm group-hover/btn:rotate-12 transition-transform">forum</span>
                  Chat
                </button>
                <button class="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl py-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:border-indigo-200 transition-all active:scale-95">
                  <span class="material-icons text-sm">person</span>
                  Profile
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <span class="material-icons text-5xl">school</span>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2 tracking-tight">Expand Your Knowledge</h3>
            <p class="text-slate-400 text-sm font-medium mb-8">You haven't connected with any teachers yet.<br>Enroll in a course to start learning!</p>
            <button class="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Explore Courses</button>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class MyTeachersComponent implements OnInit {
    private studentService = inject(StudentService);
    private chatService = inject(ChatService);

    teachers = signal<any[]>([]);

    ngOnInit() {
        this.loadTeachers();
    }

    loadTeachers() {
        this.studentService.getTeachers().subscribe(res => {
            if (res.status) {
                this.teachers.set(res.data);
            }
        });
    }

    isOnline(lastSeen: string | null): boolean {
        if (!lastSeen) return false;
        const now = new Date();
        const last = new Date(lastSeen);
        const diffInMins = Math.floor((now.getTime() - last.getTime()) / 60000);
        return diffInMins < 5;
    }

    getStatus(lastSeen: string | null): string {
        if (!lastSeen) return 'Offline';
        const now = new Date();
        const last = new Date(lastSeen);
        const diffInMins = Math.floor((now.getTime() - last.getTime()) / 60000);

        if (diffInMins < 5) return 'Active Now';
        if (diffInMins < 60) return `Seen ${diffInMins}m ago`;
        if (diffInMins < 1440) return `Seen ${Math.floor(diffInMins / 60)}h ago`;
        return `Seen ${Math.floor(diffInMins / 1440)}d ago`;
    }

    openChat(teacher: any) {
        this.chatService.isOpen.set(true);
        // Ideally we would trigger selection of the contact in the widget
        // For now, opening the widget is a great start
    }
}
