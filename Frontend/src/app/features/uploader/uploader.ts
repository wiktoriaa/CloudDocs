import { Component } from '@angular/core';
import {getDownloadURL, ref, uploadBytes} from '@angular/fire/storage';
import {addDoc, collection, Firestore} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-uploader',
  imports: [],
  templateUrl: './uploader.html',
  styleUrl: './uploader.css',
})
export class Uploader {

    public async uploadFile(storage: Storage, uid: string, file: File) {
      const storageRef = ref(storage, `documents/${uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }

    public createDocument(uid: string, url: string, file: File, firestore: Firestore) {
      addDoc(collection(firestore, 'documents'), {
        uid,
        name: file.name,
        url,
        createdAt: new Date()
      });
    }

}
