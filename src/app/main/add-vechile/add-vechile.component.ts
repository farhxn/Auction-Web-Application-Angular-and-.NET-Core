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

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      dateEnd: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(1000)]],
      ImageFile: new FormControl<null | File>(null),
    });
  }

  ngAfterViewInit(): void {}

  files: { file: File; preview: string }[] = [];

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
      this.loading = true;
      const product = this.form.value as AuctionVehicleAddEditDto;
      console.log(product);
      this.auct.addAuctionVehicle(product).subscribe({
        next: (res: any) => {
          this.form.reset();
          this.loading = false;
          this.toastr.success('Vehicle Registered Successfully', 'Success');
          // console.log(res);
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
          this.toastr.error('Unknown error occured');
        },
      });
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
}
