import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./register/register.component";
import { ToastComponent } from "./shared/toast/toast.component";
import { ConfirmDialogComponent } from "./shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
