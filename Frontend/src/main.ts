import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getStorage, provideStorage} from '@angular/fire/storage';

bootstrapApplication(App, {
  providers: [
    provideFirebaseApp(() => initializeApp(projectConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
}).catch(console.error)
