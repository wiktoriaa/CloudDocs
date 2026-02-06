import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToMyAccount() {
    this.router.navigate(['/my-account']);
  }

  navigateToFiles() {
    this.router.navigate(['/files']);
  }
}
