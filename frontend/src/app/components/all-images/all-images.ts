import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar';
import { ImageService } from '../../services/image';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-images',
  standalone: true,
  imports: [CommonModule, MatCardModule, NavbarComponent],
  templateUrl: './all-images.html'
})
export class AllImagesComponent implements OnInit {
  images: any[] = [];
  baseUrl = 'http://localhost:5000/';
  token = '';

  constructor(
    private imageSvc: ImageService,
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = this.auth.getToken() || '';
    }
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const role = this.auth.getRole();
    if (role !== 'Admin' && role !== 'Supervisor') {
      this.router.navigate(['/forbidden']);
      return;
    }
    this.imageSvc.getAllImages().subscribe({
      next: imgs => this.images = imgs,
      error: err => console.error('Failed to load images', err)
    });
  }
}