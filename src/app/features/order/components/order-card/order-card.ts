import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Order } from '@src/app/core/models/order';

@Component({
  selector: 'app-order-card',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
})
export class OrderCardComponent {
  @Input() order!: Order;
}
