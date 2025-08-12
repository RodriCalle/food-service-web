import { environment } from '@src/environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    status?: string
  ): Observable<Order[]> {
    const params: any = {};

    if (restaurantId) params.restaurantId = restaurantId;
    if (customerId) params.customerId = customerId;
    if (status) params.status = status;
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
}
