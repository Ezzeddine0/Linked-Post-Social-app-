import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly _Router = inject(Router);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  userToken: string | null = null;
  private routerSub!: Subscription;

  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.getToken();

      this.routerSub = this._Router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.getToken();
        }
      });
    }
  }

  getToken() {
    this.userToken = localStorage.getItem('userToken');
  }

  logOut() {
    localStorage.removeItem('userToken');
    this.getToken(); // instantly update navbar
    this._Router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
