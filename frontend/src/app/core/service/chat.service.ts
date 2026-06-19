import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { interval, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = `${environment.apiUrl}/chat`;

    unreadCount = signal(0);
    messages = signal<any[]>([]);
    isOpen = signal(false);

    constructor() {
        // Poll for unread count every 10 seconds if logged in
        interval(10000).pipe(
            switchMap(() => {
                const user = this.auth.currentUser();
                return user ? this.getUnreadCount() : [];
            })
        ).subscribe(res => {
            if (res.status) this.unreadCount.set(res.data);
        });
    }

    getChatHistory(otherUserId: number) {
        return this.http.get<any>(`${this.apiUrl}/history/${otherUserId}`).pipe(
            tap(res => {
                if (res.status) this.messages.set(res.data);
            })
        );
    }

    sendMessage(receiverId: number, message: string) {
        return this.http.post<any>(`${this.apiUrl}/send`, { receiver_id: receiverId, message });
    }

    getUnreadCount() {
        return this.http.get<any>(`${this.apiUrl}/unread-count`);
    }

    getChatContacts() {
        return this.http.get<any>(`${this.apiUrl}/contacts`);
    }
}
