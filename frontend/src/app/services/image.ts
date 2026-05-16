import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private api = `${environment.apiUrl}/images`;
  constructor(private http: HttpClient) {}

  upload(blob: Blob) {
    const fd = new FormData();
    fd.append('image', blob, `capture-${Date.now()}.jpg`);
    return this.http.post(`${this.api}/upload`, fd);
  }

  getMyImages()  { return this.http.get<any[]>(`${this.api}/my`); }
  getAllImages()  { return this.http.get<any[]>(`${this.api}/all`); }
}