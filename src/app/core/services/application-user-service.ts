import { environment } from '@src/environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUser } from '@app/core/models/application-user';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/application-users';

  getAll(restaurantId?: string): Observable<ApplicationUser[]> {
    let params: HttpParams = new HttpParams();

    if (restaurantId) params = params.set('restaurantId', restaurantId);

    return this.http.get<ApplicationUser[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${this.apiUrl}/${id}`);
  }

  // create(applicationUser: ApplicationUser): Observable<ApplicationUser> {
  //   return this.http.post<ApplicationUser>(this.apiUrl, applicationUser);
  // }

  // update(
  //   id: string,
  //   applicationUser: ApplicationUser
  // ): Observable<ApplicationUser> {
  //   return this.http.put<ApplicationUser>(
  //     `${this.apiUrl}/${id}`,
  //     applicationUser
  //   );
  // }

  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}
