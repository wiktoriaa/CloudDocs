import { Component } from '@angular/core';
import {getDownloadURL, ref, uploadBytes} from '@angular/fire/storage';

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

}
