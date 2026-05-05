import {inject, Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {AuthService} from './auth.service';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';

export interface FileUploadProgress {
  progress: number;
  downloadURL?: string;
  state: 'running' | 'paused' | 'success' | 'error';
}

export interface UserFile {
  fileName: string;
  fileType: string;
  downloadURL: string;
}

export interface FilesResponse {
  files: UserFile[];
}

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {
  private authService = inject(AuthService)
  private API_URL = 'http://localhost:8080/api/v1/storage'
  private httpClient = inject(HttpClient)


  uploadFile(file: File, folder: string = 'documents'): Observable<FileUploadProgress> {
      this.checkUserLoggedIn()

    return new Observable<FileUploadProgress>((subscriber: Subscriber<FileUploadProgress>) => {
      this.authService.getUserToken().then((token: string | null) => {
        const formData = new FormData();
        formData.append('document', file, file.name);

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        const req = new HttpRequest('POST', `${this.API_URL}/upload`, formData, {
          headers,
          reportProgress: true
        });

        this.httpClient.request(req).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const progress = event.total
                ? Math.round((100 * event.loaded) / event.total)
                : 0;
              subscriber.next({ progress, state: 'running' });
            } else if (event.type === HttpEventType.Response) {
              const body = event.body as Record<string, string> | null;
              subscriber.next({
                progress: 100,
                downloadURL: body?.['downloadURL'],
                state: 'success'
              });
              subscriber.complete();
            }
          },
          error: (error: unknown) => {
            subscriber.next({ progress: 0, state: 'error' });
            subscriber.error(error);
          }
        });
      }).catch((error: unknown) => {
        subscriber.error(error);
      });
    });
  }


  async getUserFiles(folder: string = 'documents'): Promise<UserFile[]> {
    this.checkUserLoggedIn()

    const files: UserFile[] = [];

    this.authService.getUserToken().then((token: string | null) => {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.httpClient.get<{ files: UserFile[] }>(`${this.API_URL}/files`, { headers }).subscribe({
        next: (response: FilesResponse) => {
          files.push(...response.files);
        },
        error: (error: unknown) => {
          console.error('Error fetching user files:', error);
        }
      });
    })
    return files
  }

  async deleteFile(filePath: string): Promise<void> {
  }

  private checkUserLoggedIn(): void {
    if (!this.authService.isUserLoggedIn()) {
      throw new Error('Użytkownik nie jest zalogowany');
    }
  }
}
