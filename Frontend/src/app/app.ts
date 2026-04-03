import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet, NavigationEnd} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Footer} from './page-template/footer/footer';
import {filter} from 'rxjs';
import {AuthService} from './services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar, MatButton, RouterLink, MatIconButton, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  isHomePage = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isHomePage = this.router.url === '/' || this.router.url === '/home';
    });
  }

  public logout() {
    this.authService.logout().then(r => {
      this.snackBar.open('Pomyślnie wylogowano', 'OK', { duration: 3000 });
      this.router.navigate(['/login']);
    });
  }

  public isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }
}
