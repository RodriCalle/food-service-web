import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '@src/app/core/services/order-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '@src/app/core/models/customer';
import { MatSelectModule } from '@angular/material/select';
import { Order } from '@src/app/core/models/order';
import { OrderCardComponent } from '../../components/order-card/order-card';
import { CustomerFormField } from '@src/app/shared/components/customer-form-field/customer-form-field';
import { RestaurantFormField } from '@src/app/shared/components/restaurant-form-field/restaurant-form-field';
import { AuthService } from '@src/app/core/services/auth-service';

@Component({
  selector: 'app-list-order',
  imports: [
    LoadingComponent,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    OrderCardComponent,
    CommonModule,
    CustomerFormField,
    RestaurantFormField,
  ],
  templateUrl: './list-order.html',
  styleUrl: './list-order.scss',
})
export class ListOrderComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  orderStatus: string[] = ['Created', 'InProgress', 'Delivered', 'Canceled'];

  filterForm = this.formBuilder.group({
    customerId: this.formBuilder.control({ value: null, disabled: false}),
    customer: this.formBuilder.control({ value: null as unknown as Customer, disabled: false}),
    restaurantId: this.formBuilder.control({ value: null, disabled: !this.authService.hasRole(['Admin'])}),
    status: this.formBuilder.control({ value: ['Created', 'InProgress'], disabled: false}, { validators: [Validators.required]}),
  });

  isLoading = this.loadingService.isLoading;
  orders$!: Observable<Order[]>;
  customers: any = [];
  filteredCustomers!: Observable<any[]>;

  ngOnInit(): void {
    const restaurantId = this.authService.getUserInfo().restaurantId;
    this.filterForm.controls.restaurantId.setValue(restaurantId);

    this.loadOrders();
  }

  resetFilters() {
    this.filterForm.patchValue({
      customerId: null,
      customer: null,
      status: null,
    });

    this.loadOrders();
  }

  loadOrders() {
    const { customer, restaurantId, status } = this.filterForm.getRawValue();

    this.loadingService.show();

    this.orders$ = this.orderService
      .getAll(
        restaurantId ?? undefined,
        customer?.id ?? undefined,
        status ?? undefined
      )
      .pipe(withLoading(this.loadingService));
  }

  onCustomerSelected(customer: any) {
    this.filterForm.patchValue({ customerId: customer });
  }
}
