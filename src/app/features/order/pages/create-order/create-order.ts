import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomerService } from '@src/app/core/services/customer-service';
import { OrderService } from '@src/app/core/services/order-service';
import { ProductService } from '@src/app/core/services/product-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { Order } from '@src/app/core/models/order';
import { OrderItem } from '@src/app/core/models/order-item';
import { OrderItemService } from '@src/app/core/services/order-item-service';
import { Router } from '@angular/router';
import { CustomerFormField } from '@src/app/shared/components/customer-form-field/customer-form-field';
import { AuthService } from '@src/app/core/services/auth-service';
import { RestaurantFormField } from '@src/app/shared/components/restaurant-form-field/restaurant-form-field';

@Component({
  selector: 'app-create-order',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    CustomerFormField,
    RestaurantFormField,
  ],
  templateUrl: './create-order.html',
  styleUrl: './create-order.scss',
})
export class CreateOrderComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly orderItemService = inject(OrderItemService);
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  categories: any[] = [];
  products: any[] = [];
  customers: any[] = [];
  filteredCustomers!: Observable<any[]>;
  filteredProducts: Observable<any[]>[] = [];

  form = this.formBuilder.group({
    observation: [''],
    customerId: [null],
    customer: [null],
    restaurantId: [
      { value: null, disabled: !this.authService.hasRole(['Admin']) },
    ],
  });

  rows: FormArray = this.formBuilder.array([]);
  formItems: FormGroup = this.formBuilder.group({
    rows: this.rows,
  });
  dataSource: MatTableDataSource<FormGroup> = new MatTableDataSource();
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
    this.dataSource = new MatTableDataSource(this.rows.controls as FormGroup[]);
    this.addRow();

    const { restaurantId } = this.authService.getUserInfo();
    this.form.controls.restaurantId.setValue(restaurantId);

    this.loadProducts();
  }

  loadProducts() {
    this.loadingService.show();

    const { restaurantId } = this.form.getRawValue();

    this.productService
      .getAll(restaurantId ?? undefined)
      .pipe(withLoading(this.loadingService))
      .subscribe((products: any[any]) => {
        this.products = products;
      });
  }

  onCustomerSelected(customer: any) {
    this.form.patchValue({ customerId: customer });
  }

  // Product Searcher
  displayProductName(product: any): string {
    return product ? product.name : '';
  }

  onProductSelected(index: number, product: any) {
    const row = this.rows.at(index) as FormGroup;
    row.patchValue({ price: product.price, productId: product });
  }

  private _filterProduct(value: any): string[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : this.displayProductName(value).toLowerCase();

    return this.products.filter((product) =>
      `${product.name}`.toLowerCase().includes(filterValue)
    );
  }

  // Products table

  addRow() {
    const row = this.formBuilder.group({
      productId: [null],
      product: [null],
      quantity: [0],
      price: [0],
      unitPrice: [0],
    });

    this.rows.push(row);
    this.updateDataSource();

    this.setupRowListeners(row);

    const index = this.rows.length - 1;

    this.filteredProducts[index] = row.controls.product.valueChanges.pipe(
      startWith(''),
      map((product) => this._filterProduct(product))
    );
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.rows.controls as FormGroup[];

    this.calculateTotalQuantity();
    this.calculateTotalPrice();
  }

  getTotalPrice(): number {
    return 0;
  }

  calculateTotalQuantity() {
    const rows = this.formItems.get('rows') as FormArray;
    if (!rows) this.totalQuantity = 0;

    this.totalQuantity = rows.controls.reduce((total, row) => {
      const quantity = row.get('quantity')?.value;
      return total + (Number(quantity) || 0);
    }, 0);
  }

  calculateTotalPrice() {
    const rows = this.formItems.get('rows') as FormArray;
    if (!rows) this.totalPrice = 0;

    this.totalPrice = rows.controls.reduce((total, row) => {
      const price = row.get('price')?.value;
      return total + (Number(price) || 0);
    }, 0);
  }

  submitOrder() {
    let order = this.form.getRawValue() as Order;
    let orderItems = this.formItems.controls['rows'].value as OrderItem[];

    order.customerId = order.customer.id;

    orderItems.forEach((orderItem) => {
      orderItem.productId = orderItem.product.id;
    });

    order.orderItems = orderItems;

    this.loadingService.show();
    this.orderService
      .createFullOrder(order)
      .pipe(withLoading(this.loadingService))
      .subscribe((response: any) => {
        this.router.navigate(['/orders/list']);
      });
  }

  isSubmitDisabled(): boolean {
    const rows = this.formItems.get('rows') as FormArray;

    if (this.dataSource.data.length === 0) return true;
    if (this.form.invalid || this.formItems.invalid) return true;

    const hasValidQuantities = rows.controls.every((row) => {
      const quantity = row.get('quantity')?.value;
      return quantity !== null && quantity !== 0;
    });
    if (!hasValidQuantities) return true;

    const customer = this.form.get('customer')?.value;
    if (typeof customer !== 'object' || customer === null) return true;

    const hasValidProduct = rows.controls.some((row) => {
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
