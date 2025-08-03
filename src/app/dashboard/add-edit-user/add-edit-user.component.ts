import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthServiceService } from '../../main/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { FirstKeyPipe } from '../../shared/pipe/first-key.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-edit-user',
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FirstKeyPipe,
    RouterLink,
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})
export class AddEditUserComponent implements OnInit {
  categories: any[] = [];
  id: any;
  selectedCategory: any;
  form: any;
  submitted = false;
  loading = false;
  showPassword = false;

  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    const isEditMode = this.id !== '0' && !!this.id;

    if (isEditMode) {
      this.userDetail();
    }

    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        isEditMode
          ? [Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]
          : [
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
            ],
      ],
    });

    this.auth.getAllRoles().subscribe({
      next: (res: any) => {
        this.categories = res.data.map((role: any) => ({
          ...role,
          name: role.name.charAt(0).toUpperCase() + role.name.slice(1),
          valueName: role.name,
        }));
        console.log('Roles fetched successfully:', this.categories);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      if (this.id == 0) {
        this.createUser();
      } else {
        const formData: any = { ...this.form.value };
        if (!formData.password) {
          delete formData.password;
        }
        this.updateUser(formData);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createUser() {
    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        this.form.reset();
        this.loading = false;
        this.submitted = false;
        this.toast.success('🎉 Registered successfully!\n Verify your email.');
        this.router.navigateByUrl('/dashboard/userlist');
      },
      error: (error) => {
        if (error.status === 400) {
          if (error.error?.data?.errors) {
            const duplicateEmailError = error.error.data.errors.find(
              (e: any) => e.code === 'DuplicateEmail'
            );
            this.toast.error(`❗ ${duplicateEmailError.description}`);
          } else if (
            error.error.message ==
            'Please use a valid, non-temporary email address.'
          ) {
            this.toast.error(
              '❗ Please use a valid Email, Temporary email address are not allowed.'
            );
          }
        } else {
          this.toast.error('❗ Registration failed. Please try again later.');
        }
        this.loading = false;
        this.submitted = false;
        console.log(error);
      },
    });
  }

  updateUser(formData: any) {
    this.auth.updateUser(formData, this.id).subscribe({
      next: (res: any) => {
        this.form.reset();
        this.loading = false;
        this.submitted = false;
        this.toast.success('🎉 Updated successfully!', 'Success');
        this.router.navigateByUrl('/dashboard/userlist');
      },
      error: (error) => {
        if (error.status === 400) {
          if (error.error?.data?.errors) {
            const duplicateEmailError = error.error.data.errors.find(
              (e: any) => e.code === 'DuplicateEmail'
            );
            this.toast.error(`❗ ${duplicateEmailError.description}`);
          } else if (
            error.error.message ==
            'Please use a valid, non-temporary email address.'
          ) {
            this.toast.error(
              '❗ Please use a valid Email, Temporary email address are not allowed.'
            );
          }
        } else {
          this.toast.error('❗ Registration failed. Please try again later.', 'Error');
        }
        this.loading = false;
        this.submitted = false;
        // console.log(error);
      },
    });
  }

  userDetail() {
    this.auth.getUserDetail(this.id).subscribe({
      next: (res: any) => {
        this.form.patchValue({
          fullName: res.data.fullName,
          role: res.data.role,
          email: res.data.email,
          password: res.data.password,
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
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
