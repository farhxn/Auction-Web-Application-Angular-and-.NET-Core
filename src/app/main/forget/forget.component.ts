import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css',
})
export class ForgetComponent implements OnInit {
  form: any;
  submitted = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private toast: ToastrService,
    private routesLink: Router,
    public formBuilder: FormBuilder,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      console.log(this.form.value);
      this.authService.forgetPassword(this.form.value).subscribe({
        next: (res) => {
          this.toast.success('Reset link sent to your email');
          this.routesLink.navigate(['/login']);
        },
        error: (err) => {
          if (err.error.message === 'Account Not Found') {
            this.toast.error('Account not found with this email');
          }
          else if(err.error.message === "Email is not verified.Verification mail has been send") {
            this.toast.error('Email is not verified. Verification mail has been sent');
          }
          else {
            this.toast.error('Something went wrong, please try again later');
          }
          console.log(err);

          this.loading = false;
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
}
