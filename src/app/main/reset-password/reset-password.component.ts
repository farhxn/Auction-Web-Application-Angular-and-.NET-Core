import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirstKeyPipe } from '../../shared/pipe/first-key.pipe';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { NotyfService } from '../../shared/notyf.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  form: any;
  submitted = false;
  loading = false;
  showPassword = false;
  showPassword1 = false;
  userId = '';
  token = '';

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private notyf: NotyfService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const rawUrl = this.route.url;
  const rawQuery = rawUrl.split('?')[1] || '';
  const tokenMatch = rawQuery.match(/token=([^&]+)/);
  const userIdMatch = rawQuery.match(/userId=([^&]+)/);

  const rawToken = tokenMatch ? tokenMatch[1] : '';
  const rawUserId = userIdMatch ? decodeURIComponent(userIdMatch[1]) : '';

  console.log('RAW (encoded) token:', rawToken);
  console.log('RAW (decoded) userId:', rawUserId);


    this.form = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        userId: [rawUserId],
        token: [rawToken],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;

      console.log(this.form.value);

      this.authService.resetPassword(this.form.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.notyf.success('✅ Password has been reset successfully.');
            this.route.navigate(['/login']);
        },
        error: (error: any) => {

          if (error.error.message == '❌ Password reset failed.') {
            this.notyf.error(
              'Reset Link Expired.'
            );
            this.route.navigate(['/login']);
          } else {
            this.notyf.error(error.error.message || 'An error occurred');
          }
          console.log(error);

          this.loading = false;
        },
      });
    } else {
      console.log('Form is invalid');
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (
      password &&
      confirmPassword &&
      (password.value != confirmPassword.value || !confirmPassword.value)
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  };

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.submitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showPassword1 = !this.showPassword1;
  }
}
