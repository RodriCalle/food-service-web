import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '@src/app/core/models/order';
import { OrderService } from '@src/app/core/services/order-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';

@Component({
  selector: 'app-order-card',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe, MatChipsModule, CommonModule],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Output() statusChanged = new EventEmitter<void>();
  private orderService = inject(OrderService);
  private loadingService = inject(LoadingService);

  getChipClass(status: number): string {
    switch (status) {
      case 0: return 'chip-created';
      case 1: return 'chip-in-progress';
      case 2: return 'chip-delivered';
      case 3: return 'chip-canceled';
      default: return '';
    }
  }
  
  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Creado';
      case 1: return 'En preparación';
      case 2: return 'Entregado';
      case 3: return 'Cancelado';
      default: return 'Desconocido';
    }
  }

  changeStatusToInProgress() {
    this.orderService.changeStatusToInProgress(this.order.id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {this.statusChanged.emit();});
  }

  cancelOrder() {
    this.orderService.delete(this.order.id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {this.statusChanged.emit();});
  }
  changeStatusToDelivered() {
    this.orderService.changeStatusToDelivered(this.order.id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {this.statusChanged.emit();});
  }
}
