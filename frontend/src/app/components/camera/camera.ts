import { Component, ViewChild, ElementRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from '../../services/image';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, MatButtonModule, NavbarComponent],
  templateUrl: './camera.html',
  styleUrls: ['./camera.scss']
})
export class CameraComponent implements OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  capturedImage: string | null = null;
  myImages: any[] = [];
  message = '';
  cameraActive = false;
  baseUrl = 'http://localhost:5000/';
  token = '';

  constructor(
    private imageSvc: ImageService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = this.auth.getToken() || '';
      this.loadMyImages();
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
    const blob = this.dataURLtoBlob(this.capturedImage);
    this.imageSvc.upload(blob).subscribe({
      next: () => {
        this.message = 'Image saved successfully!';
        this.capturedImage = null;
        this.loadMyImages();
      },
      error: () => this.message = 'Failed to save image.'
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
    this.imageSvc.getMyImages().subscribe(imgs => this.myImages = imgs);
  }

  ngOnDestroy() { this.stopCamera(); }
}