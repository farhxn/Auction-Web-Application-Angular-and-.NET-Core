import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../main/service/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

    constructor(private router: Router, public auth: AuthServiceService) {}

    onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
