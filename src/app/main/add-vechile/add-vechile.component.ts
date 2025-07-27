import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-vechile',
  imports: [RouterLink, NgxDropzoneModule, CommonModule],
  templateUrl: './add-vechile.component.html',
  styleUrl: './add-vechile.component.css',
})
export class AddVechileComponent implements AfterViewInit {
  constructor(private toastr: ToastrService) {}

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
    this.files.forEach((item, index) => {
      console.log(`File #${index + 1}:`, item.file);
    });
  }
}
