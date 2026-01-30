import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-account',
  imports: [AsyncPipe, MatButton, RouterLink],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount {
  authService = inject(AuthService);

  protected onLogout() {
    this.authService.logout().then(r => console.log("Wylogowano:", r));
  }
}
