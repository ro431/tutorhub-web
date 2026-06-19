import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/service/chat.service';
import { AuthService } from '../../core/service/auth.service';
import { TeacherService } from '../../core/service/teacher.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Button -->
    <div class="fixed bottom-6 right-6 z-[999]">
      <button (click)="toggleChat()" 
              class="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group animate-bounce-subtle">
        <span class="material-icons text-3xl group-hover:rotate-12 transition-transform">{{ chatService.isOpen() ? 'close' : 'forum' }}</span>
        @if (chatService.unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white animate-pulse">
            {{ chatService.unreadCount() }}
          </span>
        }
      </button>

      <!-- Chat Window -->
      @if (chatService.isOpen()) {
        <div class="absolute bottom-20 right-0 w-[380px] h-[580px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
          
          <!-- Header -->
          <div class="p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-indigo-50/50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              @if (selectedContact()) {
                <button (click)="selectedContact.set(null)" class="p-2 hover:bg-white/50 rounded-xl transition-colors">
                  <span class="material-icons text-indigo-600">arrow_back</span>
                </button>
                <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  {{ selectedContact().name.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-800 leading-none">{{ selectedContact().name }}</h3>
                  <span class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              } @else {
                <h3 class="text-lg font-black text-slate-800 tracking-tight">Messages</h3>
              }
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            @if (selectedContact()) {
              <!-- Chat History -->
              <div class="space-y-4">
                @for (msg of chatService.messages(); track msg.id) {
                  <div [class]="'flex ' + (msg.sender_id === auth.currentUser()?.id ? 'justify-end' : 'justify-start')">
                    <div [class]="'max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ' + (msg.sender_id === auth.currentUser()?.id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none')">
                      {{ msg.message }}
                      <div [class]="'text-[9px] mt-1 opacity-60 ' + (msg.sender_id === auth.currentUser()?.id ? 'text-indigo-100' : 'text-slate-400')">
                        {{ msg.created_at | date:'shortTime' }}
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Contacts List -->
              <div class="space-y-3">
                @for (contact of contacts(); track contact.id) {
                  <button (click)="selectContact(contact)" 
                          class="w-full p-4 hover:bg-white/60 rounded-3xl border border-transparent hover:border-indigo-100 transition-all duration-300 flex items-center gap-4 group">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      {{ contact.name.charAt(0) }}
                    </div>
                    <div class="text-left flex-1 min-w-0">
                      <h4 class="text-sm font-black text-slate-800 tracking-tight">{{ contact.name }}</h4>
                      <p class="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{{ contact.role }}</p>
                    </div>
                    <span class="material-icons text-slate-300 group-hover:text-indigo-600 transition-colors">navigate_next</span>
                  </button>
                } @empty {
                  <div class="py-20 text-center">
                    <span class="material-icons text-4xl text-slate-200 mb-3">chat_bubble_outline</span>
                    <p class="text-slate-400 text-xs font-black uppercase tracking-widest">No active chats</p>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Input Area -->
          @if (selectedContact()) {
            <div class="p-4 bg-white/50 border-t border-slate-100/50">
              <div class="relative">
                <input [(ngModel)]="newMessage" 
                       (keyup.enter)="send()"
                       placeholder="Type your message..." 
                       class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-4 pr-12 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all">
                <button (click)="send()" 
                        class="absolute right-2 top-1.5 w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all">
                  <span class="material-icons text-lg">send</span>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      
      @keyframes bounce-subtle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
    </style>
  `
})
export class ChatWidgetComponent implements OnInit {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  private teacherService = inject(TeacherService);

  contacts = signal<any[]>([]);
  selectedContact = signal<any>(null);
  newMessage = '';

  constructor() {
    // When selected contact changes, load its history
    effect(() => {
      const contact = this.selectedContact();
      if (contact) {
        this.chatService.getChatHistory(contact.id).subscribe();
      }
    }, { allowSignalWrites: true });

    // When chat opens externally, load contacts
    effect(() => {
      if (this.chatService.isOpen()) {
        this.loadContacts();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.chatService.getUnreadCount().subscribe(res => {
      if (res.status) this.chatService.unreadCount.set(res.data);
    });
  }

  toggleChat() {
    this.chatService.isOpen.update(v => !v);
  }

  loadContacts() {
    const user = this.auth.currentUser();
    if (!user) return;

    // Load actual chat contacts first
    this.chatService.getChatContacts().subscribe(res => {
      let chatContacts = res.data || [];

      // If no chats, for teachers, show enrolled students as potential contacts
      // For students, show their teachers
      if (chatContacts.length === 0) {
        if (user.role === 'teacher') {
          this.teacherService.getEnrolledStudents(user.id).subscribe(sRes => {
            const students = (sRes.data || []).map((s: any) => ({
              id: s.student_id,
              name: s.student_name,
              email: s.student_email,
              role: 'student'
            }));
            this.contacts.set(students);
          });
        } else if (user.role === 'student') {
          // Here we'd fetch student's teachers. For simplicity, let's keep it based on active chats for now
        }
      } else {
        this.contacts.set(chatContacts);
      }
    });
  }

  selectContact(contact: any) {
    this.selectedContact.set(contact);
  }

  send() {
    const contact = this.selectedContact();
    if (!contact || !this.newMessage.trim()) return;

    this.chatService.sendMessage(contact.id, this.newMessage).subscribe(res => {
      if (res.status) {
        this.newMessage = '';
        this.chatService.getChatHistory(contact.id).subscribe();
      }
    });
  }
}
