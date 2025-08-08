import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/roles';

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(role: string) {
    return this.http.post<any>(this.apiUrl, role);
  }

  delete(role: string) {
    return this.http.delete<void>(`${this.apiUrl}/${role}`);
  }
}
