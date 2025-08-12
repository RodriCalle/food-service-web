import { environment } from '@src/environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '@app/core/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/orders';

  getAll(
    restaurantId?: string,
    customerId?: string,
    status?: any[]
  ): Observable<Order[]> {
    let params: HttpParams = new HttpParams();

    if (restaurantId) params = params.set('restaurantId', restaurantId);
    if (customerId) params = params.set('customerId', customerId);
    if (status) {
      if (status && status.length > 0) {
        status.forEach(s => {
          params = params.append('status', s);
        });
      }
    }

    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  createFullOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/full-order`, order);
  }

  update(id: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  changeStatusToInProgress(id: string) {
    return this.http.post<void>(`${this.apiUrl}/${id}/status/in-progress`, {});
  }

  changeStatusToDelivered(id: string) {
    return this.http.post<void>(`${this.apiUrl}/${id}/status/delivered`, {});
    
  }
}
