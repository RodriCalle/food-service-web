import { environment } from '@src/environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@app/core/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/products';

  getAll(restaurantId?: string, categoryId?: string): Observable<Product[]> {
    let params: HttpParams = new HttpParams();

    if (restaurantId) params = params.set('restaurantId', restaurantId);
    if (categoryId) params = params.set('categoryId', categoryId);

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
