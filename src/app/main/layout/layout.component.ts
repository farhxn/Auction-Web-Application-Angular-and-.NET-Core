import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthServiceService } from '../service/auth-service.service';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: [
    './layout.component.css',
    '../../../assets/css/style.css'
  ]
})
export class LayoutComponent implements OnInit {
  showInnerHeaderClass = false;
      dropdownOpen = false;

  constructor(private router: Router,private auth:AuthServiceService) {}


  checkLogin() {
    // this.auth.
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
