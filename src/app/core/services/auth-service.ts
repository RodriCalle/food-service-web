import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationUser } from '@src/app/core/models/application-user';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

const CLAIMS = {
  id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  restaurantId:
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/groupsid',
  role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/auth';

  private readonly tokenKey = 'token';
  private userInfoCache: any;

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userInfoCache = null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const jsonDecoded = JSON.parse(decoded);

    if (!decoded) return null;

    return {
      id: jsonDecoded[CLAIMS.id],
      name: jsonDecoded[CLAIMS.name],
      email: jsonDecoded[CLAIMS.email],
      role: jsonDecoded[CLAIMS.role],
      restaurantId: jsonDecoded[CLAIMS.restaurantId],
      exp: jsonDecoded['exp'],
    };
  }

  getUserInfo() {
    if (this.userInfoCache) {
      return this.userInfoCache;
    }
    this.userInfoCache = this.decodeToken();
    return this.userInfoCache;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(rolesAllowed: string[]): boolean {
    const role = this.getUserInfo().role;
    if (rolesAllowed.includes(role)) {
      return true;
    }
    return false;
  }

  create(applicationUser: ApplicationUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, applicationUser);
  }
}
