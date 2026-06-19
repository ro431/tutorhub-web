import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
    private http = inject(HttpClient);

    private getHeaders() {
        const token = localStorage.getItem('token');
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getStats() {
        return this.http.get(`${environment.apiUrl}/admin/stats`, { headers: this.getHeaders() });
    }

    getTeachers() {
        return this.http.get(`${environment.apiUrl}/admin/teachers`, { headers: this.getHeaders() });
    }

    getStudents() {
        return this.http.get(`${environment.apiUrl}/admin/students`, { headers: this.getHeaders() });
    }

    getCourses() {
        return this.http.get(`${environment.apiUrl}/admin/courses`, { headers: this.getHeaders() });
    }

    getEnrollments() {
        return this.http.get(`${environment.apiUrl}/admin/enrollments`, { headers: this.getHeaders() });
    }

    updateProfile(data: any) {
        return this.http.put(`${environment.apiUrl}/admin/profile`, data, { headers: this.getHeaders() });
    }

    deleteUser(id: number) {
        return this.http.delete(`${environment.apiUrl}/admin/users/${id}`, { headers: this.getHeaders() });
    }
}
