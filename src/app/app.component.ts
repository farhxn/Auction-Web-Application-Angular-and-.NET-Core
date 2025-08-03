import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { ScriptLoaderService } from './shared/script-loader.service';
import { Notyf } from 'notyf';

import 'notyf/notyf.min.css';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'auctionWebsite';

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private scriptLoader: ScriptLoaderService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const pageTitle = data['title']
          ? `Auction Website | ${data['title']}`
          : 'Auction Website';
        this.titleService.setTitle(pageTitle);
      });
  }

  ngOnInit() {
    
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => !event.url.startsWith('/dashboard'))
      )
      .subscribe(() => {
        setTimeout(() => {
          if (window['initializeAllUI']) {
            window['initializeAllUI']();
          }
        }, 0);
      });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.startsWith('/dashboard')) {
          this.scriptLoader.loadScripts([
            'dashboard/assets/js/config.js',
            'dashboard/assets/js/vendor.js',
            'dashboard/assets/js/app.js',
            'dashboard/assets/js/pages/dashboard.js',
          ]);
        }
      });
  }
}
