import {Component, OnInit} from '@angular/core';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  ngOnInit(): void {
  }

  logIn(auth: Auth, email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password).then(r => null);
  }

}
