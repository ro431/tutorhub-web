import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
    selector: 'app-admin-shell',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-slate-50 text-slate-800 font-sans">
      <!-- Sidebar -->
      <aside class="w-64 border-r border-slate-200 bg-white flex flex-col shadow-sm z-20">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-2xl font-black tracking-tighter text-slate-800 hover:scale-105 transition-transform origin-left">Admin<span class="text-indigo-500">Hub</span></h2>
          <p class="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">System Administrator</p>
        </div>
        
        <nav class="flex-1 p-4 space-y-2 mt-4">
          <a routerLink="overview" routerLinkActive="bg-indigo-50 text-indigo-600 font-bold" 
             class="flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group font-medium">
            <span class="material-icons text-xl group-hover:scale-110 transition-transform">dashboard</span> Overview
          </a>
          <a routerLink="users" routerLinkActive="bg-indigo-50 text-indigo-600 font-bold" 
             class="flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group font-medium">
            <span class="material-icons text-xl group-hover:scale-110 transition-transform">group</span> Users List
          </a>
          <a routerLink="enrollments" routerLinkActive="bg-indigo-50 text-indigo-600 font-bold" 
             class="flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group font-medium">
            <span class="material-icons text-xl group-hover:scale-110 transition-transform">sync_alt</span> Sync Records
          </a>
          <a routerLink="profile" routerLinkActive="bg-indigo-50 text-indigo-600 font-bold" 
             class="flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all group font-medium">
            <span class="material-icons text-xl group-hover:scale-110 transition-transform">settings</span> System Config
          </a>
        </nav>

        <div class="p-6 border-t border-slate-100">
          <button (click)="logout()" class="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 font-bold rounded-2xl hover:bg-rose-500 hover:text-white transition-all text-sm group">
            <span class="material-icons text-sm group-hover:-translate-x-1 transition-transform">logout</span>
            Terminate Session
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <header class="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-10 shadow-sm z-10 sticky top-0">
          <div class="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Access Granted</span>
          </div>
          <div class="flex items-center gap-4">
             <div class="text-right">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Lead</p>
                <p class="text-sm font-bold text-slate-800">{{auth.currentUser()?.name || 'Administrator'}}</p>
             </div>
             <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
               {{ (auth.currentUser()?.name || 'A')[0] }}
             </div>
          </div>
        </header>
        
        <div class="flex-1 overflow-y-auto p-10 relative">
           <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
    auth = inject(AuthService);

    logout() {
        this.auth.logout();
    }
}
