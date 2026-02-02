import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FileStorageService, UserFile, FileUploadProgress } from '../../services/file-storage.service';

@Component({
  selector: 'app-uploader',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule
  ],
  templateUrl: './uploader.html',
  styleUrl: './uploader.css',
})
export class Uploader implements OnInit {
  private fileStorageService = inject(FileStorageService);
  private snackBar = inject(MatSnackBar);

  files: UserFile[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;
  isLoading: boolean = true;

  ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    this.isLoading = true;
    try {
      this.files = await this.fileStorageService.getUserFiles();
    } catch (error) {
      console.error('Błąd podczas ładowania plików:', error);
      this.snackBar.open('Nie udało się załadować plików', 'OK', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

 onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  uploadFile(file: File) {
    this.isUploading = true;
    this.uploadProgress = 0;

    this.fileStorageService.uploadFile(file).subscribe({
      next: (progress: FileUploadProgress) => {
        this.uploadProgress = progress.progress;
        if (progress.state === 'success') {
          this.snackBar.open(`Plik "${file.name}" został przesłany!`, 'OK', { duration: 3000 });
          this.loadFiles();
        }
      },
      error: (error) => {
        console.error('Błąd przesyłania:', error);
        this.snackBar.open('Błąd podczas przesyłania pliku', 'OK', { duration: 3000 });
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  async deleteFile(file: UserFile) {
    if (confirm(`Czy na pewno chcesz usunąć plik "${this.getDisplayName(file.name)}"?`)) {
      try {
        await this.fileStorageService.deleteFile(file.fullPath);
        this.snackBar.open('Plik został usunięty', 'OK', { duration: 3000 });
        this.loadFiles();
      } catch (error) {
        console.error('Błąd usuwania:', error);
        this.snackBar.open('Nie udało się usunąć pliku', 'OK', { duration: 3000 });
      }
    }
  }

  downloadFile(file: UserFile) {
    window.open(file.downloadURL, '_blank');
  }

  getDisplayName(fileName: string): string {
    // Usuwamy timestamp z początku nazwy pliku
    const parts = fileName.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return fileName;
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc':
      case 'docx': return 'description';
      case 'xls':
      case 'xlsx': return 'table_chart';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'mp4':
      case 'avi':
      case 'mov': return 'video_file';
      case 'mp3':
      case 'wav': return 'audio_file';
      case 'zip':
      case 'rar': return 'folder_zip';
      default: return 'insert_drive_file';
    }
  }
}
