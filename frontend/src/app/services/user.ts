import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll()               { return this.http.get<any[]>(this.api); }
  create(data: any)      { return this.http.post(this.api, data); }
  updateRole(id: string, role: string) {
    return this.http.patch(`${this.api}/${id}/role`, { role });
  }
  delete(id: string)     { return this.http.delete(`${this.api}/${id}`); }
}