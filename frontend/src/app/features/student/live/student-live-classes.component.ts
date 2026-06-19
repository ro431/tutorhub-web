import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClassService } from '../../../core/service/live-class.service';

@Component({
    selector: 'app-student-live-classes',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Live Learning</h1>
        <p class="text-slate-500 font-medium">Join scheduled interactive sessions with your instructors</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (session of sessions(); track session.id) {
          <div class="group relative bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 border-b-4 border-b-indigo-500/20 hover:border-b-indigo-500 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <div class="relative">
                  <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform duration-500">
                    <img [src]="session.teacher_profile || 'https://ui-avatars.com/?name=' + session.teacher_name" 
                         class="w-full h-full object-cover rounded-[1.2rem] border-2 border-white">
                  </div>
                  @if (session.status === 'ongoing') {
                    <div class="absolute -top-1 -right-1 flex">
                      <span class="relative flex h-4 w-4">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                      </span>
                    </div>
                  }
                </div>
                <div class="flex flex-col items-end">
                   <span [ngClass]="{
                    'bg-red-50 text-red-600 border-red-100': session.status === 'ongoing',
                    'bg-indigo-50 text-indigo-600 border-indigo-100': session.status === 'scheduled'
                   }" class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border">
                    {{ session.status === 'ongoing' ? 'LIVE NOW' : 'UPCOMING' }}
                   </span>
                </div>
              </div>

              <div class="mb-6">
                <span class="text-[10px] font-black uppercase tracking-widest text-indigo-500">{{ session.course_name }}</span>
                <h3 class="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{{ session.title }}</h3>
                <p class="text-slate-400 text-sm font-medium">Instructor: {{ session.teacher_name }}</p>
                <div class="mt-4 flex items-center gap-2">
                    <span class="material-icons text-indigo-400 text-sm">schedule</span>
                    <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ session.start_time | date:'medium' }}</span>
                </div>
              </div>

              <a [href]="session.meeting_link" target="_blank"
                 [ngClass]="{
                   'bg-red-600 hover:bg-slate-800': session.status === 'ongoing',
                   'bg-slate-100 text-slate-400 cursor-not-allowed': session.status === 'scheduled'
                 }"
                 class="w-full flex items-center justify-center gap-2 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 group/btn">
                <span class="material-icons text-sm group-hover/btn:scale-110 transition-transform">
                  {{ session.status === 'ongoing' ? 'play_circle' : 'lock' }}
                </span>
                {{ session.status === 'ongoing' ? 'Join Class' : 'Available at Start' }}
              </a>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <span class="material-icons text-5xl">person_off</span>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2 tracking-tight">No Active Sessions</h3>
            <p class="text-slate-400 text-sm font-medium">There are no live classes scheduled for your courses at the moment.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class StudentLiveClassesComponent implements OnInit {
    private liveClassService = inject(LiveClassService);
    sessions = signal<any[]>([]);

    ngOnInit() {
        this.loadSessions();
    }

    loadSessions() {
        this.liveClassService.getStudentLiveClasses().subscribe({
            next: (res: any) => this.sessions.set(res.data)
        });
    }
}
