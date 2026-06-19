import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { ToastService } from '../shared/toast/toast.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = signal(false);
  profilePreview = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['student', [Validators.required]],
      profile: ['https://ui-avatars.com/api/?name=User'] // default
    });
  }

  ngOnInit() {}

  onProfileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.form.patchValue({ profile: base64String });
        this.profilePreview.set(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    // If user hasn't uploaded a profile picture, generate an avatar dynamically based on their name
    if (this.form.get('profile')?.value === 'https://ui-avatars.com/api/?name=User' && this.form.get('name')?.value) {
       this.form.patchValue({ profile: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.form.get('name')?.value) });
    }

    if (this.form.valid) {
      this.loading.set(true);
      this.auth.register(this.form.value).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.toast.show('Registration successful! Please login.', 'success');
            this.router.navigate(['/login']);
          } else {
            this.toast.show(response.msg || 'Registration failed', 'error');
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.toast.show('Registration failed. Please try again.', 'error');
          this.loading.set(false);
        }
      });
    } else {
      this.toast.show('Please fill in all required fields correctly.', 'error');
    }
  }
}
