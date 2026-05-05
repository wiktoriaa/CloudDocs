import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatCardModule} from '@angular/material/card'
import {MatListModule} from '@angular/material/list'
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'
import {FileStorageService, FileUploadProgress, UserFile} from '../../services/file-storage.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'
import {DecimalPipe} from '@angular/common'

@Component({
  selector: 'app-uploader',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule,
    MatSnackBarModule,
    DecimalPipe
  ],
  templateUrl: './uploader.html',
  styleUrl: './uploader.css',
})
export class Uploader implements OnInit {
  private fileStorageService = inject(FileStorageService)
  private snackBar = inject(MatSnackBar)
  private authService = inject(AuthService)
  private router = inject(Router)
  private cdr = inject(ChangeDetectorRef)

  files = signal<UserFile[]>([])
  uploadProgress = signal(0)
  isUploading = signal(false)
  isLoading = signal(true)

  ngOnInit() {
    if (!this.authService.isUserLoggedIn()) {
      this.snackBar.open('Musisz być zalogowany, aby zarządzać plikami', 'OK', { duration: 3000 })
      this.router.navigate(['/login'])
      return
    }

    this.loadFiles()
  }

  async loadFiles() {
    this.isLoading.set(true)

    try {
      this.files.set(await this.fileStorageService.getUserFiles())
    } catch (error) {
      console.error('Błąd podczas ładowania plików:', error)
      setTimeout(() => {
        this.snackBar.open('Nie udało się załadować plików', 'OK', { duration: 3000 })
      })
    } finally {
      setTimeout(() => {
        this.isLoading.set(false)
        this.cdr.detectChanges()
      })
    }
  }

 onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0])
    }
  }

  uploadFile(file: File) {
    this.isUploading.set(true)
    this.uploadProgress.set(0)

    this.fileStorageService.uploadFile(file).subscribe({
      next: (progress: FileUploadProgress) => {
        this.uploadProgress.set(progress.progress)
        if (progress.state === 'success') {
          setTimeout(() => {
            this.snackBar.open(`Plik "${file.name}" został przesłany!`, 'OK', { duration: 3000 })
          })
          this.loadFiles()
        }
      },
      error: (error) => {
        console.error('Błąd przesyłania:', error)
        setTimeout(() => {
          this.snackBar.open('Błąd podczas przesyłania pliku', 'OK', { duration: 3000 })
          this.isUploading.set(false)
          this.cdr.detectChanges()
        })
      },
      complete: () => {
        setTimeout(() => {
          this.isUploading.set(false)
          this.uploadProgress.set(0)
          this.cdr.detectChanges()
        })
      }
    })
  }

  async deleteFile(file: UserFile) {
    if (confirm(`Czy na pewno chcesz usunąć plik "${this.getDisplayName(file.fileName)}"?`)) {
      try {
        await this.fileStorageService.deleteFile(file.fileName)
        setTimeout(() => {
          this.snackBar.open('Plik został usunięty', 'OK', { duration: 3000 })
        })
        this.loadFiles()
      } catch (error) {
        console.error('Błąd usuwania:', error)
        setTimeout(() => {
          this.snackBar.open('Nie udało się usunąć pliku', 'OK', { duration: 3000 })
        })
      }
    }
  }

  downloadFile(file: UserFile) {
    window.open(file.downloadURL, '_blank')
  }

  getDisplayName(fileName: string): string {
    const parts = fileName.split('_')
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_')
    }
    return fileName
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return 'picture_as_pdf'
      case 'doc':
      case 'docx': return 'description'
      case 'xls':
      case 'xlsx': return 'table_chart'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image'
      case 'mp4':
      case 'avi':
      case 'mov': return 'video_file'
      case 'mp3':
      case 'wav': return 'audio_file'
      case 'zip':
      case 'rar': return 'folder_zip'
      default: return 'insert_drive_file'
    }
  }
}
