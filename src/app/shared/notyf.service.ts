import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root',
})
export class NotyfService {
  private notyf = new Notyf({
    duration: 4000,
    ripple: true, // ✅ Ripple effect enabled
    dismissible: true, // ✅ Allows user to close it manually
    position: { x: 'right', y: 'top' },
    types: [
      {
        type: 'warning',
        background: 'orange',
        icon: {
          className: 'fas fa-exclamation-triangle',
          tagName: 'i',
          text: '',
        },
      },
      {
        type: 'info',
        background: '#3498db',
        icon: {
          className: 'fas fa-info-circle',
          tagName: 'i',
          text: '',
        },
      },
    ],
  });

  success(message: string) {
    this.notyf.success(message);
  }

  error(message: string) {
    this.notyf.error(message);
  }

  warning(message: string) {
    this.notyf.open({ type: 'warning', message });
  }

  info(message: string) {
    this.notyf.open({ type: 'info', message });
  }
}
