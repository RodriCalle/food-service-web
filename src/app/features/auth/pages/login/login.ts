import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    LoadingComponent,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  isLoading = this.loadingService.isLoading;
  hidePassword: boolean = true;

  constructor() {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingService.show();
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .pipe(withLoading(this.loadingService))
        .subscribe((response: any) => {
          this.router.navigate(['/dashboard']);
          this.saveToken(response.token);
        });
    }
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
}
