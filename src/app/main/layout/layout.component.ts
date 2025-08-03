import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthServiceService } from '../service/auth-service.service';
import { CurrencySelectorComponent } from "../shared/currency-selector/currency-selector.component";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule, CurrencySelectorComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css', '../../../assets/css/style.css'],
})
export class LayoutComponent implements OnInit,AfterViewInit {
  showInnerHeaderClass = false;

  constructor(private router: Router, public auth: AuthServiceService) {}


  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string) {
    this.showInnerHeaderClass = url === '/' || url === '';
  }


}
