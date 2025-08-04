import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';
import { AuctionVehicleAddEditDto } from '../shared/model/auctionVehicle';
import { AuctionVehicleService } from '../service/auction-vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-vechile',
  imports: [RouterLink, NgxDropzoneModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-vechile.component.html',
  styleUrl: './add-vechile.component.css',
})
export class AddVechileComponent implements AfterViewInit, OnInit {
  constructor(
    private toastr: ToastrService,
    private auct: AuctionVehicleService
  ) {}

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  image64?: string = '';
  form!: FormGroup;
  loading: boolean = false;
  submitted = false;
  imageError = false;
  minDate: string = '';
  files: { file: File; preview: string }[] = [];

  ngOnInit(): void {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + 5)); // 5 days ahead
    this.minDate = futureDate.toISOString().split('T')[0]; // format: YYYY-MM-DD

    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      dateEnd: [this.minDate, Validators.required],
      basePrice: ['1000', [Validators.required, Validators.min(1000)]],
      ImageFiles: new FormControl<null | File>(null),
    });
  }

  ngAfterViewInit(): void {}

  onSelect(event: any) {
    for (const file of event.addedFiles) {
      if (!file.type.startsWith('image/')) {
        console.warn('Only image files are allowed:', file.name);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.files.push({ file, preview: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onRemove(index: number) {
    this.files.splice(index, 1);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.files.length === 0) {
        this.imageError = true; // 👈 show error in template
        this.toastr.error('Please upload at least one image', 'Error');
        return;
      }

      this.loading = true;
      const product = this.form.value as AuctionVehicleAddEditDto;
      product.ImageFiles = this.files.map((f) => f.file);

      console.log(product);
      this.auct.addAuctionVehicle(product).subscribe({
        next: (res: any) => {
          this.resetForm();
          this.files = [];
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Vehicle Registered',
            text: 'The auction vehicle was successfully added!',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
          });

          // this.toastr.success('Vehicle Registered Successfully', 'Success');
          // console.log(res);
        },
        error: (err) => {
          if (err.error.message === 'At least one image is required') {
            this.toastr.error('Image is required', 'Error');
          } else {
            const errorMsg = err?.error?.message || 'Unknown error occurred';
            Swal.fire({
              icon: 'error',
              title: 'Submission Failed',
              text: errorMsg,
              confirmButtonColor: '#d33',
              confirmButtonText: 'Close',
            });

            // this.toastr.error('Unknown error occurred');
          }
          console.log(err);
          this.loading = false;
        },
      });
    } else {
      this.form.markAllAsTouched();
    }

    this.files.forEach((item, index) => {
      console.log(`File #${index + 1}:`, item.file);
    });
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.submitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }

  resetForm() {
    this.form.reset({
      id: 0,
      name: '',
      description: '',
      dateEnd: this.minDate,
      basePrice: 1000,
      ImageFiles: null,
    });
    this.files = []; // clear uploaded files
  }
}
