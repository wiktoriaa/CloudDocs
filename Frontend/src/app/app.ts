import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Footer} from './page-template/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon, MatListItem, MatNavList, MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar, MatButton, RouterLink, MatIconButton, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
