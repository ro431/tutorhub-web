import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import { ChatService } from '../../../core/service/chat.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-10 w-1 bg-indigo-500 rounded-full"></div>
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">Student Dashboard</h2>
      </div>

      <div class="flex items-center gap-6">
        <!-- Chat/Message Icon -->
        <div class="relative group">
          <button (click)="chatService.isOpen.set(true)" 
                  class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 focus:outline-none overflow-visible">
            <span class="material-icons text-2xl">forum</span>
            
            @if (chatService.unreadCount() > 0) {
              <span class="absolute -top-1 -right-1 flex h-6 w-6">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-rose-600 text-[10px] font-black text-white border-2 border-white shadow-sm">
                  {{ chatService.unreadCount() }}
                </span>
              </span>
            }
          </button>
        </div>

        <!-- Notifications -->
        <button class="relative p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all group">
          <svg class="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <!-- Profile Brief -->
        <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold text-slate-900 leading-tight">{{ user()?.name || 'Loading...' }}</p>
            <p class="text-xs font-medium text-slate-500 lowercase">{{ user()?.email }}</p>
          </div>
          <div class="h-10 w-10 rounded-full bg-slate-100 border-2 border-indigo-500 p-0.5 overflow-hidden ring-4 ring-indigo-50">
            <img [src]="user()?.profile || 'https://ui-avatars.com/?name=' + user()?.name" class="h-full w-full object-cover rounded-full">
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  chatService = inject(ChatService);
  user = this.authService.currentUser;

  ngOnInit() {
    this.chatService.getUnreadCount().subscribe(res => {
      if (res.status) this.chatService.unreadCount.set(res.data);
    });
  }
}
