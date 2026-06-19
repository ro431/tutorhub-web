import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourseService } from '../core/service/course.service';
import { AuthService } from '../core/service/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  private courseService = inject(CourseService);
  auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    console.log('HomeComponent initialized');
    this.loadCourses();
  }

  loadCourses() {
    console.log('Loading courses...');
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        console.log('Courses response:', response);
        if (response.status) {
          this.courses = response.data;
          console.log('Courses loaded:', this.courses);
        }
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  searchQuery = '';

  get filteredCourses() {
    if (!this.searchQuery) return this.courses;
    const q = this.searchQuery.toLowerCase();
    return this.courses.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.subject?.toLowerCase().includes(q) || 
      c.teacher_name?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  }

  showModal = false;
  modalMessage = '';
  modalActionUrl = '';
  modalActionText = '';

  onApplyCourse(course: any) {
    const user = this.auth.currentUser();
    if (!user) {
      this.modalMessage = 'Registration is required to apply for this course. Would you like to register now?';
      this.modalActionUrl = '/register';
      this.modalActionText = 'Register Now';
      this.showModal = true;
    } else {
      if (user.role === 'student') {
        this.router.navigate(['/student']);
      } else {
        this.modalMessage = 'Only students can apply for courses.';
        this.modalActionUrl = '';
        this.modalActionText = '';
        this.showModal = true;
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }

  get dashboardLink(): string {
    const user = this.auth.currentUser();
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  }
}