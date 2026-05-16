import { Component, ViewChild, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ImageService } from '../../services/image';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, MatButtonModule, NavbarComponent, MatProgressSpinnerModule],
  templateUrl: './camera.html',
  styleUrls: ['./camera.scss']
})
export class CameraComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  capturedImage: string | null = null;
  myImages: any[] = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  cameraActive = false;
  isSaving = false;
  isLoadingImages = false;
  baseUrl = 'http://localhost:5000/';
  token = '';

constructor(
  private imageSvc: ImageService,
  private auth: AuthService,
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    this.token = this.auth.getToken() || '';

    queueMicrotask(() => {
      this.loadMyImages();
    });
  }
}

  async startCamera() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      this.capturedImage = null;
      this.message = '';
      this.cameraActive = true;
      await new Promise(resolve => setTimeout(resolve, 100));
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoEl.nativeElement.srcObject = this.stream;
    } catch (err) {
      this.message = 'Camera access denied. Please allow camera permissions.';
      this.messageType = 'error';
      this.cameraActive = false;
    }
  }

  capture() {
    const video = this.videoEl.nativeElement;
    const canvas = this.canvasEl.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    this.capturedImage = canvas.toDataURL('image/jpeg');
    this.stopCamera();
  }

  saveImage() {
    if (!this.capturedImage) return;
    this.isSaving = true;
    this.message = '';
    const blob = this.dataURLtoBlob(this.capturedImage);
    this.imageSvc.upload(blob).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Image saved successfully!';
        this.messageType = 'success';
        this.capturedImage = null;
        this.loadMyImages();
      },
      error: () => {
        this.isSaving = false;
        this.message = 'Failed to save image. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  }

  stopCamera() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.cameraActive = false;
  }

loadMyImages() {
  this.isLoadingImages = true;

  this.imageSvc.getMyImages().subscribe({
    next: imgs => {
      this.myImages = [...imgs];

      this.isLoadingImages = false;

      this.cdr.detectChanges();
    },

    error: err => {
      console.error(err);

      this.isLoadingImages = false;

      this.cdr.detectChanges();
    }
  });
}

  ngOnDestroy() { this.stopCamera(); }
}