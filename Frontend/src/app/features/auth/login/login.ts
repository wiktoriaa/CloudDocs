import {Component, OnInit} from '@angular/core';
import {signInWithEmailAndPassword} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  ngOnInit(): void {
  }

  logIn(auth, email, password) {
    signInWithEmailAndPassword(auth, email, password);
  }

}
