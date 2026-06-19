import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);

  getAllCourses() {
    return this.http.get(`${environment.apiUrl}/course`);
  }
}