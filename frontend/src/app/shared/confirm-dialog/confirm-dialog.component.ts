import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../core/service/dialog.service';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (dialog.state().options) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
             (click)="dialog.close(false)"></div>
        
        <!-- Dialog Content -->
        <div class="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
          <div class="p-8">
            <!-- Icon -->
            <div [ngClass]="{
              'bg-red-50 text-red-600': dialog.state().options?.type === 'danger',
              'bg-indigo-50 text-indigo-600': dialog.state().options?.type === 'info',
              'bg-amber-50 text-amber-600': dialog.state().options?.type === 'warning'
            }" class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <span class="material-icons text-3xl">
                {{ dialog.state().options?.type === 'danger' ? 'report_problem' : 
                   dialog.state().options?.type === 'warning' ? 'warning' : 'info' }}
              </span>
            </div>

            <!-- Text -->
            <h2 class="text-2xl font-black text-slate-800 mb-2">{{ dialog.state().options?.title }}</h2>
            <p class="text-slate-500 font-medium leading-relaxed">{{ dialog.state().options?.message }}</p>

            <!-- Actions -->
            <div class="mt-10 flex flex-col sm:flex-row gap-3">
              <button (click)="dialog.close(false)" 
                      class="flex-1 px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                {{ dialog.state().options?.cancelText }}
              </button>
              <button (click)="dialog.close(true)" 
                      [ngClass]="{
                        'bg-red-600 hover:bg-slate-800 shadow-red-100': dialog.state().options?.type === 'danger',
                        'bg-indigo-600 hover:bg-slate-800 shadow-indigo-100': dialog.state().options?.type === 'info',
                        'bg-amber-600 hover:bg-slate-800 shadow-amber-100': dialog.state().options?.type === 'warning'
                      }"
                      class="flex-1 px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg transition-all">
                {{ dialog.state().options?.confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
    dialog = inject(DialogService);
}
