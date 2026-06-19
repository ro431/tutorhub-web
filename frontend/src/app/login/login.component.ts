import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { ToastService } from '../shared/toast/toast.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.auth.login(this.form.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            // The backend sends token and user inside response.data
            const token = response.data.token;
            const user = response.data.user;

            this.auth.saveToken(token, user);
            this.toast.show('Login successful!', 'success');
            
            // Redirect based on role
            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (user.role === 'teacher') {
              this.router.navigate(['/teacher']);
            } else if (user.role === 'student') {
              this.router.navigate(['/student']);
            } else {
              this.router.navigate(['/']); // Fallback
            }
          } else {
            this.toast.show(response.msg || 'Login failed', 'error');
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.toast.show('Login failed. Please try again.', 'error');
          this.loading.set(false);
        }
      });
    } else {
      this.toast.show('Please fill in all required fields correctly.', 'error');
    }
  }
}
