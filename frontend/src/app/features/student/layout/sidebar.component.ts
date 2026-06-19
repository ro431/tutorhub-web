import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="w-64 bg-slate-900 border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300">
      <div class="p-6">
        <h1 class="text-2xl font-black text-white tracking-tighter">Student<span class="text-indigo-500">Hub</span></h1>
      </div>
      
      <nav class="flex-1 px-4 space-y-2 mt-4">
        <a routerLink="./overview" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span class="font-medium">Overview</span>
        </a>
        
        <a routerLink="./courses" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332 0.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332 0.477-4.5 1.253"></path></svg>
          <span class="font-medium">Find Courses</span>
        </a>
        
        <a routerLink="./enrollments" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          <span class="font-medium">My Enrollments</span>
        </a>

        <a routerLink="./teachers" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
          <span class="font-medium">My Teachers</span>
        </a>

        <a routerLink="./live-classes" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z"></path></svg>
          <span class="font-medium">Live Classes</span>
        </a>
        
        <a routerLink="./profile" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all group">
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <span class="font-medium">Profile</span>
        </a>
      </nav>
      
      <div class="p-6 border-t border-white/5">
        <button (click)="logout()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all group">
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="font-bold">Logout</span>
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
