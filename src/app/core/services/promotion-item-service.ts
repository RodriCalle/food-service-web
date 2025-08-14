import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { PromotionItem } from '@app/core/models/promotion-item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionItemService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/api/promotionItem-items';

  getAll(): Observable<PromotionItem[]> {
    return this.http.get<PromotionItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<PromotionItem> {
    return this.http.get<PromotionItem>(`${this.apiUrl}/${id}`);
  }

  create(promotionItem: PromotionItem): Observable<PromotionItem> {
    return this.http.post<PromotionItem>(this.apiUrl, promotionItem);
  }

  update(id: string, promotionItem: PromotionItem): Observable<PromotionItem> {
    return this.http.put<PromotionItem>(`${this.apiUrl}/${id}`, promotionItem);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
