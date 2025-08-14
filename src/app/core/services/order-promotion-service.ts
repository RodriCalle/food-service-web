import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';
import { OrderPromotion } from '@app/core/models/order-promotion';

@Injectable({
  providedIn: 'root'
})
export class OrderPromotionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/order-promotions';
  
  getAll(): Observable<OrderPromotion[]> {
    return this.http.get<OrderPromotion[]>(this.apiUrl);
  }

  getById(id: string): Observable<OrderPromotion> {
    return this.http.get<OrderPromotion>(`${this.apiUrl}/${id}`);
  }

  create(orderPromotion: OrderPromotion): Observable<OrderPromotion> {
    return this.http.post<OrderPromotion>(this.apiUrl, orderPromotion);
  }

  update(id: string, orderPromotion: OrderPromotion): Observable<OrderPromotion> {
    return this.http.put<OrderPromotion>(`${this.apiUrl}/${id}`, orderPromotion);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
