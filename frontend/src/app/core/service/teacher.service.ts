import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Course {
    id?: number;
    teacher_id: number;
    subject: string;
    description: string;
    content: string;
    fee: number;
    mode: string;
    start_date: string;
    end_date: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}`;

    // Courses
    getCoursesByTeacher(teacherId: number) {
        return this.http.get<any>(`${this.apiUrl}/course/teacher/${teacherId}`);
    }

    createCourse(course: Course) {
        return this.http.post<any>(`${this.apiUrl}/course`, course);
    }

    updateCourse(courseId: number, course: Partial<Course>) {
        return this.http.put<any>(`${this.apiUrl}/course/${courseId}`, course);
    }

    deleteCourse(courseId: number) {
        return this.http.delete<any>(`${this.apiUrl}/course/${courseId}`);
    }

    // Enrollments
    getPendingEnrollments(teacherId: number) {
        return this.http.get<any>(`${this.apiUrl}/enrollment/pending/${teacherId}`);
    }

    approveEnrollment(requestId: number, data: any) {
        return this.http.put<any>(`${this.apiUrl}/enrollment/approve/${requestId}`, data);
    }

    rejectEnrollment(requestId: number) {
        return this.http.put<any>(`${this.apiUrl}/enrollment/reject/${requestId}`, {});
    }

    getEnrolledStudents(teacherId: number) {
        return this.http.get<any>(`${this.apiUrl}/enrollment/teacher/${teacherId}`);
    }

    unenrollStudent(enrollmentId: number) {
        return this.http.delete<any>(`${this.apiUrl}/enrollment/${enrollmentId}`);
    }

    // Notifications
    getNotifications() {
        return this.http.get<any>(`${this.apiUrl}/notification/teacher`);
    }

    // Profile
    getProfile(userId: number) {
        return this.http.get<any>(`${this.apiUrl}/teacher/profile/user/${userId}`);
    }

    createProfile(data: any) {
        return this.http.post<any>(`${this.apiUrl}/teacher/profile`, data);
    }

    updateProfile(profileId: number, data: any) {
        return this.http.put<any>(`${this.apiUrl}/teacher/profile/${profileId}`, data);
    }
}
