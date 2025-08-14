import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/core/services/auth-service';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { LoadingComponent } from "@src/app/shared/components/loading/loading";
import { RestaurantFormField } from "@src/app/shared/components/restaurant-form-field/restaurant-form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ProductFormField } from "@src/app/shared/components/product-form-field/product-form-field";
import { Promotion } from '@src/app/core/models/promotion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { CustomerFormField } from '@src/app/shared/components/customer-form-field/customer-form-field';
import { PromotionItem } from '@src/app/core/models/promotion-item';

@Component({
  selector: 'app-create-promotion',
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
    RestaurantFormField,
    LoadingComponent,
    ProductFormField
  ],
  templateUrl: './create-promotion.html',
  styleUrl: './create-promotion.scss'
})
export class CreatePromotionComponent implements OnInit {
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  isLoading = this.loadingService.isLoading;
  dataSource = new MatTableDataSource<FormGroup>();

  form = this.formBuilder.group({
    id: [''],
    name: [''],
    price: [0],
    restaurantId: [
      { value: null, disabled: !this.authService.hasRole(['Admin']) },
    ],
    promotionItems: this.formBuilder.nonNullable.array([]),
  });

  ngOnInit(): void {
    const { restaurantId } = this.authService.getUserInfo();
    this.form.controls.restaurantId.setValue(restaurantId);

    this.addItem();
    this.updateDataSource();
  }

  updateDataSource() {
    this.dataSource.data = this.promotionItems.controls as FormGroup[];
  }

  get promotionItems(): FormArray {
    return this.form.get('promotionItems') as FormArray;
  }

  getProductControl(index: number) {
    return this.promotionItems.at(index).get('product') as FormControl;
  }

  onProductSelected(index: number, product: any) {
    this.promotionItems.at(index).patchValue({ product });
  }

  // Table
  addItem() {
    const group = this.formBuilder.group({
      productId: [{ value: null, disabled: false}],
      product: [{ value: null, disabled: false }, { validators: [Validators.required] }],
      quantity: [{ value: 0, disabled: false }, { validators: [Validators.required] }]
    });
    this.promotionItems.push(group);
    this.updateDataSource()
  }

  removeItem(index: number) {
    this.promotionItems.removeAt(index);
    this.updateDataSource()
  }

  submitPromotion() {
    let promotion = this.form.getRawValue() as Promotion;

    promotion.promotionItems.forEach((promotionItem) => {
      promotionItem.productId = promotionItem.product.id;
    });

    console.log('Guardando promoción', promotion);
  }

  isSubmitDisabled() {
    if (this.promotionItems.length === 0) return true;
    if (this.form.invalid || this.promotionItems.invalid) return true;

    const hasValidProduct = this.promotionItems.controls.some((row) => {
      const product = row.get('product')?.value;
      return typeof product === 'object';
    });

    if (!hasValidProduct) return true;

    return false;
  }
}
