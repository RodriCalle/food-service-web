import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@src/app/core/services/product-service';
import { LoadingService } from '../../services/loading-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { withLoading } from '../../operators/with-loading';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-product-form-field',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,],
  templateUrl: './product-form-field.html',
  styleUrl: './product-form-field.scss'
})
export class ProductFormField {
  @Input({ required: true }) control!: FormControl;
  @Input() isRequired = false;
  @Input() restaurantId!: string | null;

  @Output() productSelected = new EventEmitter<any>();

  private readonly productService = inject(ProductService);
  private readonly loadingService = inject(LoadingService);

  products: any[] = [];
  filteredProducts$!: Observable<any[]>;

  ngOnInit() {
    this.loadProducts();

    this.filteredProducts$ = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProduct(value))
    );
  }

  loadProducts() {
    this.loadingService.show();
    this.productService
      .getAll(this.restaurantId ?? undefined)
      .pipe(withLoading(this.loadingService))
      .subscribe((products) => {
        this.products = products;
      });
  }

  displayProductName(product: any): string {
    return product ? product.name : '';
  }

  private _filterProduct(value: any): any[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : this.displayProductName(value).toLowerCase();

    return this.products.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }

  onProductSelected(product: any) {
    this.productSelected.emit(product);
  }

}
