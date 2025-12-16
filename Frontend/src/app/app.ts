import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PageHeader} from './page-template/page-header/page-header';
import {PageFooter} from './page-template/page-footer/page-footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageHeader, PageFooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CloudDocs');
}
