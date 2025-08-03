import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthServiceService } from '../../main/service/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-role',
  imports: [
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './add-edit-role.component.html',
  styleUrl: './add-edit-role.component.css',
})
export class AddEditRoleComponent implements OnInit {
  id: any;
  selectedCategory: any;
  form: any;
  submitted = false;
  loading = false;

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
      this.roleDetail();
    }

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log(this.form.value);
      this.loading = true;

      if (this.id == 0) {
        this.createRole();
      } else {
        this.updateRole(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  createRole() {
    this.auth.createRole(this.form.value).subscribe({
      next: (res: any) => {
        this.form.reset();
        this.loading = false;
        this.submitted = false;
        this.toast.success('🎉 Role created successfully!', 'Success');
        this.router.navigateByUrl('/dashboard/rolelist');
        console.log(res);

      },
      error: (error) => {
        this.toast.error('❗ Role creation failed. Please try again later.', 'Error');
        this.loading = false;
        this.submitted = false;
        console.log(error);
      },
    });
  }

  updateRole(formData: any) {
    this.auth.updateRole(formData, this.id).subscribe({
      next: (res: any) => {
        this.form.reset();
        this.loading = false;
        this.submitted = false;
        this.toast.success('🎉 Updated successfully!', 'Success');
        this.router.navigateByUrl('/dashboard/rolelist');
      },
      error: (error) => {
        this.toast.error('❗ Update failed. Please try again later.', 'Error');
        this.loading = false;
        this.submitted = false;
        console.log(error);
      },
    });
  }

  roleDetail() {
    this.auth.getRoleDetail(this.id).subscribe({
      next: (res: any) => {
        console.log(res.data);
        this.form.patchValue({
          name: res.data.name,
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
}
