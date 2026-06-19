import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
    private baseUrl = `${environment.apiUrl}/student`;

    constructor(private http: HttpClient) { }

    getAvailableCourses() {
        return this.http.get(`${this.baseUrl}/courses`);
    }

    getProfile() {
        return this.http.get(`${this.baseUrl}/profile`);
    }

    updateProfile(data: any) {
        return this.http.put(`${this.baseUrl}/profile`, data);
    }

    getEnrollments() {
        return this.http.get(`${this.baseUrl}/enrollments`);
    }

    getTeachers() {
        return this.http.get<any>(`${this.baseUrl}/teachers`);
    }

    getRequests() {
        return this.http.get(`${this.baseUrl}/requests`);
    }

    sendEnrollmentRequest(courseId: number) {
        return this.http.post(`${this.baseUrl}/requests`, { course_id: courseId });
    }

    cancelRequest(requestId: number) {
        return this.http.delete(`${this.baseUrl}/requests/${requestId}`);
    }

    leaveCourse(courseId: number) {
        return this.http.delete(`${this.baseUrl}/enrollments/${courseId}`);
    }
}
