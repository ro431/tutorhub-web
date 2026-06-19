import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/guard/auth.guard';
import { StudentShellComponent } from './features/student/layout/student-shell.component';
import { OverviewComponent } from './features/student/overview/overview.component';
import { CourseCatalogComponent } from './features/student/courses/course-catalog.component';
import { MyEnrollmentsComponent } from './features/student/enrollments/my-enrollments.component';
import { MyTeachersComponent } from './features/student/teachers/my-teachers.component';
import { ProfileComponent } from './features/student/profile/profile.component';
import { TeacherShellComponent } from './features/teacher/layout/teacher-shell.component';
import { TeacherOverviewComponent } from './features/teacher/overview/teacher-overview.component';
import { TeacherCoursesComponent } from './features/teacher/courses/teacher-courses.component';
import { TeacherEnrollmentsComponent } from './features/teacher/enrollments/teacher-enrollments.component';
import { TeacherProfileComponent } from './features/teacher/profile/teacher-profile.component';
import { TeacherStudentsComponent } from './features/teacher/students/teacher-students.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-shell.component';
import { AdminOverviewComponent } from './features/admin/overview/admin-overview.component';
import { AdminUsersComponent } from './features/admin/users/admin-users.component';
import { AdminEnrollmentsComponent } from './features/admin/enrollments/admin-enrollments.component';
import { AdminProfileComponent } from './features/admin/profile/admin-profile.component';
import { TeacherLiveClassesComponent } from './features/teacher/live/teacher-live-classes.component';
import { StudentLiveClassesComponent } from './features/student/live/student-live-classes.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'student',
        component: StudentShellComponent,
        canActivate: [authGuard],
        children: [
            { path: 'overview', component: OverviewComponent },
            { path: 'courses', component: CourseCatalogComponent },
            { path: 'enrollments', component: MyEnrollmentsComponent },
            { path: 'teachers', component: MyTeachersComponent },
            { path: 'live-classes', component: StudentLiveClassesComponent },
            { path: 'profile', component: ProfileComponent },
            { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    {
        path: 'teacher',
        component: TeacherShellComponent,
        canActivate: [authGuard],
        children: [
            { path: 'overview', component: TeacherOverviewComponent },
            { path: 'courses', component: TeacherCoursesComponent },
            { path: 'enrollments', component: TeacherEnrollmentsComponent },
            { path: 'students', component: TeacherStudentsComponent },
            { path: 'live-classes', component: TeacherLiveClassesComponent },
            { path: 'profile', component: TeacherProfileComponent },
            { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'overview', component: AdminOverviewComponent },
            { path: 'users', component: AdminUsersComponent },
            { path: 'enrollments', component: AdminEnrollmentsComponent },
            { path: 'profile', component: AdminProfileComponent },
            { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
