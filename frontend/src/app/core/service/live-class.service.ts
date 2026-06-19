import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LiveClassService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/live-classes`;

    scheduleLiveClass(data: any) {
        return this.http.post(`${this.baseUrl}/schedule`, data);
    }

    getTeacherLiveClasses() {
        return this.http.get<any>(`${this.baseUrl}/teacher`);
    }

    getStudentLiveClasses() {
        return this.http.get<any>(`${this.baseUrl}/student`);
    }

    updateStatus(id: number, status: string) {
        return this.http.put(`${this.baseUrl}/${id}/status`, { status });
    }

    deleteLiveClass(id: number) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
