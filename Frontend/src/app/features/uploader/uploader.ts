import { Component } from '@angular/core';
import {getDownloadURL, ref, uploadBytes} from '@angular/fire/storage';
import {addDoc, collection} from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-uploader',
  imports: [],
  templateUrl: './uploader.html',
  styleUrl: './uploader.css',
})
export class Uploader {

    public uploadFile(storage, uid, file) {
      const storageRef = ref(storage, `documents/${uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }

    public createDocument(uid, url, file, firestore) {
      addDoc(collection(firestore, 'documents'), {
        uid,
        name: file.name,
        url,
        createdAt: new Date()
      });
    }

}
