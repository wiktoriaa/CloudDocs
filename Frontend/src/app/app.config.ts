import {provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';

import {routes} from './app.routes';
import {App} from './app';
import {projectConfig} from '../environments/environment.prod';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideFirebaseApp(() => initializeApp(projectConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
}).catch(console.error)
