import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject, UploadTaskSnapshot } from '@angular/fire/storage';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface FileUploadProgress {
  progress: number;
  downloadURL?: string;
  state: 'running' | 'paused' | 'success' | 'error';
}

export interface UserFile {
  name: string;
  fullPath: string;
  downloadURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  private storage = inject(Storage);
  private auth = inject(Auth);

  // Przesyłanie pliku z obserwacją postępu
  uploadFile(file: File, folder: string = 'documents'): Observable<FileUploadProgress> {
    return new Observable(observer => {
      const user = this.auth.currentUser;
      if (!user) {
        observer.error('Użytkownik nie jest zalogowany');
        return;
      }

      const filePath = `users/${user.uid}/${folder}/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({
            progress,
            state: snapshot.state as 'running' | 'paused'
          });
        },
        (error) => {
          observer.next({ progress: 0, state: 'error' });
          observer.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          observer.next({ progress: 100, downloadURL, state: 'success' });
          observer.complete();
        }
      );
    });
  }

  // Pobierz listę plików użytkownika
  async getUserFiles(folder: string = 'documents'): Promise<UserFile[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Użytkownik nie jest zalogowany');

    const folderRef = ref(this.storage, `users/${user.uid}/${folder}`);
    const result = await listAll(folderRef);

    const files: UserFile[] = [];
    for (const item of result.items) {
      const downloadURL = await getDownloadURL(item);
      files.push({
        name: item.name,
        fullPath: item.fullPath,
        downloadURL
      });
    }
    return files;
  }

  // Usuń plik
  async deleteFile(filePath: string): Promise<void> {
    const fileRef = ref(this.storage, filePath);
    await deleteObject(fileRef);
  }
}
