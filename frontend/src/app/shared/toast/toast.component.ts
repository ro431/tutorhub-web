import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if (toast.toast(); as t) {
    <div class="fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-medium animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-md border border-white/20"
         [ngClass]="t.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'">
      <div class="flex items-center gap-3">
        @if (t.type === 'success') {
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        } @else {
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        }
        <span>{{ t.msg }}</span>
      </div>
    </div>
  }
  `
})
export class ToastComponent {
  constructor(public toast: ToastService) { }
}
