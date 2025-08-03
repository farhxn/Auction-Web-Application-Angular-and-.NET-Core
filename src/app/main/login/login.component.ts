import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../service/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form: any;
  submitted = false;
  loading = false;
  showPassword = false;

  constructor(
    private route: ActivatedRoute,
    private toast:ToastrService,
    private routesLink: Router,
    public formBuilder: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.route.queryParamMap.subscribe(async (params) => {
      const token = params.get('token')!;
      if (token) {
        this.toast.success('🎉 Email verified successfully!','Congratulations');
        this.routesLink.navigateByUrl('/login');
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.authService.saveToken(response.data.token);
          this.toast.success('Login successful!','Congratulations');
          const userRole = this.authService.getClaims()?.role;
          if (userRole === 'admin') {
            window.open('/dashboard/main', '_blank');
          }
          this.routesLink.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          if (
            error.status === 400 &&
            error.error.message ==
              'Email is not verified.Verification mail has been send'
          ) {
            this.toast.error(
              'Email is not verified.new verification mail has been sent'
            );
          } else {
            this.toast.error('Login failed. Please check your credentials.');
          }
        },
      });
    } else {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

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
}
