import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { Promotion } from '@app/core/models/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/promotions';

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  create(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promotion);
  }

  update(id: string, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promotion);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
