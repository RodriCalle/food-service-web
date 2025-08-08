import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loading = signal(false);

  isLoading = this.loading.asReadonly();

  show() {
    this.loading.set(true);
  }

  hide() {
    this.loading.set(false);
  }

  toggle() {
    this.loading.update((value) => !value);
  }
}
