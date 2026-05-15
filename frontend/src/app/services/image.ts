import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private api = 'http://localhost:5000/api/images';
  constructor(private http: HttpClient) {}

  upload(blob: Blob) {
    const fd = new FormData();
    fd.append('image', blob, `capture-${Date.now()}.jpg`);
    return this.http.post(`${this.api}/upload`, fd);
  }

  getMyImages()  { return this.http.get<any[]>(`${this.api}/my`); }
  getAllImages()  { return this.http.get<any[]>(`${this.api}/all`); }
}