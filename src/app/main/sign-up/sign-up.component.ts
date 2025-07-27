import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstKeyPipe } from '../../shared/pipe/first-key.pipe';
import { AuthServiceService } from '../service/auth-service.service';
import { NotyfService } from '../../shared/notyf.service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  providers: [],
})
export class SignUpComponent implements OnInit {
  @ViewChild('emailInput') emailInput!: ElementRef;

  form: any;
  submitted = false;
  loading = false;
  showPassword = false;
  showPassword1 = false;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private notyf: NotyfService,
    private route : Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      // console.log('Form Submitted!', this.form.value);
      this.authService.register(this.form.value).subscribe({
        next: (response) => {
          this.form.reset();
          this.loading = false;
          this.submitted = false;
          this.notyf.success('🎉 Registered successfully!\n Verify your email.');
          this.route.navigateByUrl('/login');
        },
        error: (error) => {
          if (error.status === 400) {
            if (error.error?.data?.errors) {
              const duplicateEmailError = error.error.data.errors.find(
                (e: any) => e.code === 'DuplicateEmail'
              );
              this.notyf.error(`❗ ${duplicateEmailError.description}`);
            } else if (
              error.error.message ==
              'Please use a valid, non-temporary email address.'
            ) {
              this.emailInput.nativeElement.focus();
              this.emailInput.nativeElement.value = '';
              // this.form.markAllAsTouched();

              this.notyf.error(
                '❗ Please use a valid Email, Temporary email address are not allowed.'
              );
            }
          } else {
            this.notyf.error('❗ Registration failed. Please try again later.');
          }
          this.loading = false;
          this.submitted = false;
        },
      });
    } else {
      // console.log('Form is invalid');
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
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
