import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderService } from '@src/app/core/services/order-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { Order } from '@src/app/core/models/order';
import { OrderItem } from '@src/app/core/models/order-item';
import { Router } from '@angular/router';
import { CustomerFormField } from '@src/app/shared/components/customer-form-field/customer-form-field';
import { AuthService } from '@src/app/core/services/auth-service';
import { RestaurantFormField } from '@src/app/shared/components/restaurant-form-field/restaurant-form-field';
import { LoadingComponent } from "@src/app/shared/components/loading/loading";
import { ProductFormField } from "@src/app/shared/components/product-form-field/product-form-field";

@Component({
  selector: 'app-create-order',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    CurrencyPipe,
    CustomerFormField,
    RestaurantFormField,
    LoadingComponent,
    ProductFormField
],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
})
export class CreateOrderComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  isLoading = this.loadingService.isLoading;
  dataSource = new MatTableDataSource<FormGroup>();

  form = this.formBuilder.group({
    observation: [''],
    customerId: [null],
    customer: [null],
    restaurantId: [
      { value: null, disabled: !this.authService.hasRole(['Admin']) },
    ],
    orderItems: this.formBuilder.nonNullable.array([]),
  });

  totalQuantity: number = 0;
  totalPrice: number = 0;

  displayedColumns: string[] = [
    'product',
    'quantity',
    'unitPrice',
    'price',
    'actions',
  ];  

  ngOnInit(): void {
    const { restaurantId } = this.authService.getUserInfo();
    this.form.controls.restaurantId.setValue(restaurantId);
    
    this.addItem();
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.orderItems.controls as FormGroup[];
  }

  get orderItems(): FormArray {
    return this.form.get('orderItems') as FormArray;
  }

  getProductControl(index: number) {
    return this.orderItems.at(index).get('product') as FormControl;
  }

  onCustomerSelected(customer: any) {
    this.form.patchValue({ customerId: customer });
  }

  onProductSelected(index: number, product: any) {
    const row = this.orderItems.at(index) as FormGroup;
    row.patchValue({ price: product.price, productId: product });
  }

  // Table
  addItem() {
    const group = this.formBuilder.group({
      productId: [null],
      product: [null],
      quantity: [0],
      price: [0],
      unitPrice: [0],
    });
    this.orderItems.push(group);

    this.setupRowListeners(group);
    this.updateDataSource();
  }

  removeItem(index: number) {
    this.orderItems.removeAt(index);
    this.updateDataSource();
    this.calculateTotalQuantity();
    this.calculateTotalPrice();
  }

  calculateTotalQuantity() {
    if (!this.orderItems) this.totalQuantity = 0;

    this.totalQuantity = this.orderItems.controls.reduce((total, row) => {
      const quantity = row.get('quantity')?.value;
      return total + (Number(quantity) || 0);
    }, 0);
  }

  calculateTotalPrice() {
    if (!this.orderItems) this.totalPrice = 0;

    this.totalPrice = this.orderItems.controls.reduce((total, row) => {
      const price = row.get('price')?.value;
      return total + (Number(price) || 0);
    }, 0);
  }

  submitOrder() {
    let order = this.form.getRawValue() as Order;

    order.customerId = order.customer.id;

    order.orderItems.forEach((orderItem) => {
      orderItem.productId = orderItem.product.id;
    });

    console.log(order);


    // this.loadingService.show();
    // this.orderService
    //   .createFullOrder(order)
    //   .pipe(withLoading(this.loadingService))
    //   .subscribe((response: any) => {
    //     this.router.navigate(['/orders/list']);
    //   });
  }

  isSubmitDisabled(): boolean {
    if (this.orderItems.length === 0) return true;
    if (this.form.invalid || this.orderItems.invalid) return true;

    const hasValidQuantities = this.orderItems.controls.every((row) => {
      const quantity = row.get('quantity')?.value;
      return quantity !== null && quantity !== 0;
    });
    if (!hasValidQuantities) return true;

    const customer = this.form.get('customer')?.value;
    if (typeof customer !== 'object' || customer === null) return true;

    const hasValidProduct = this.orderItems.controls.some((row) => {
      const product = row.get('product')?.value;
      return typeof product === 'object';
    });

    if (!hasValidProduct) return true;

    return false;
  }

  private setupRowListeners(row: FormGroup) {
    const quantityControl = row.get('quantity');
    const productControl = row.get('product');
    const priceControl = row.get('price');
    const unitPriceControl = row.get('unitPrice');

    quantityControl?.valueChanges.subscribe((quantity) => {
      const product = productControl?.value;
      if (typeof product === 'object' && product?.price != null) {
        const unitPrice = product.price;
        priceControl?.setValue((quantity * unitPrice).toFixed(2), {
          emitEvent: false,
        });
      } else {
        priceControl?.setValue(0, { emitEvent: false });
      }
      this.calculateTotalQuantity();
      this.calculateTotalPrice();
    });

    productControl?.valueChanges.subscribe((product) => {
      const quantity = quantityControl?.value;
      if (typeof product === 'object' && product?.price != null) {
        const unitPrice = product.price;
        priceControl?.setValue((quantity * unitPrice).toFixed(2), {
          emitEvent: false,
        });
        unitPriceControl?.setValue(unitPrice.toFixed(2), {
          emitEvent: false,
        });
      } else {
        unitPriceControl?.setValue(0, { emitEvent: false });
        priceControl?.setValue(0, { emitEvent: false });
      }
      this.calculateTotalPrice();
    });
  }
}
