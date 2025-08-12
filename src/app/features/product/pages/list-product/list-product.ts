import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '@src/app/core/models/product';
import { CategoryService } from '@src/app/core/services/category-service';
import { ProductService } from '@src/app/core/services/product-service';
import { RestaurantService } from '@src/app/core/services/restaurant-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { RestaurantFormField } from '@src/app/shared/components/restaurant-form-field/restaurant-form-field';
import { CategoryFormField } from '@src/app/shared/components/category-form-field/category-form-field';
import { AuthService } from '@src/app/core/services/auth-service';
import { Observable } from 'rxjs';
import { Restaurant } from '@src/app/core/models/restaurant';
import { Category } from '@src/app/core/models/category';

@Component({
  selector: 'app-list-product',
  imports: [
    CommonModule,
    MatTableModule,
    LoadingComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSelectModule,
    DatePipe,
    RestaurantFormField,
    CategoryFormField,
  ],
  templateUrl: './list-product.html',
  styleUrl: './list-product.scss',
})
export class ListProductComponent implements AfterViewInit, OnInit {
  private readonly productService = inject(ProductService);
  private readonly restaurantService = inject(RestaurantService);
  private readonly authService = inject(AuthService);
  private readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formMode: 'create' | 'edit' = 'create';
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'stock',
    'price',
    'restaurant',
    'category',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'status',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Product>([]);
  restaurants$!: Observable<Restaurant[]>;
  categories$!: Observable<Category[]>;
  isLoading = this.loadingService.isLoading;
  form = this.formBuilder.group({
    id: this.formBuilder.control({ value: '', disabled: false }),
    name: this.formBuilder.nonNullable.control({ value: '', disabled: false }, { validators: [Validators.required]}),
    description: this.formBuilder.nonNullable.control({ value: '', disabled: false }, { validators: [Validators.required]}),
    stock: this.formBuilder.nonNullable.control({ value: 0, disabled: false }, { validators: [Validators.required]}),
    price: this.formBuilder.nonNullable.control({ value: 0, disabled: false }, { validators: [Validators.required]}),
    restaurantId: this.formBuilder.control({ value: '', disabled: !this.authService.hasRole(['Admin']) }, { validators: [Validators.required]}),
    categoryId: this.formBuilder.control({ value: '', disabled: false }, { validators: [Validators.required]}),
  });
  filterForm = this.formBuilder.group({
    restaurantId: this.formBuilder.control({ value: null, disabled: !this.authService.hasRole(['Admin']) }),
    categoryId: this.formBuilder.control({ value: null, disabled: !this.authService.hasRole(['Admin']) }),
  });

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadCategories();

    const restaurantId = this.authService.getUserInfo().restaurantId;
    this.form.controls.restaurantId.setValue(restaurantId);
    this.filterForm.controls.restaurantId.setValue(restaurantId);

    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  resetFilters() {
    this.filterForm.patchValue({
      restaurantId: null,
      categoryId: null,
    });

    this.loadProducts();
  }

  saveProduct() {
    if (this.formMode === 'create') {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  loadProducts() {
    const { restaurantId, categoryId } = this.filterForm.getRawValue();

    this.loadingService.show();
    this.productService
      .getAll(restaurantId ?? undefined, categoryId ?? undefined)
      .pipe(withLoading(this.loadingService))
      .subscribe((products: any[any]) => {
        this.dataSource.data = products;
      });
  }

  loadCategories() {
    this.loadingService.show();
    
    this.categories$ = this.categoryService
      .getAll()
      .pipe(withLoading(this.loadingService));
  }

  loadRestaurants() {
    this.loadingService.show();
    
    this.restaurants$ = this.restaurantService
      .getAll()
      .pipe(withLoading(this.loadingService));
  }

  cancelEditMode() {
    this.formMode = 'create';
    this.form.reset();
  }

  createProduct() {
    if (this.form.invalid) return;

    let product = this.form.getRawValue() as Product;

    this.loadingService.show();
    this.productService
      .create(product)
      .pipe(withLoading(this.loadingService))
      .subscribe((newProduct: any) => {
        this.form.reset();
        this.loadProducts();
      });
  }

  editProduct(product: any) {
    this.formMode = 'edit';
    console.log(product);
    this.form.patchValue(product);
  }

  updateProduct() {
    if (this.form.invalid) return;
    this.loadingService.show();

    let product = this.form.getRawValue() as Product;

    this.productService
      .update(product.id, product)
      .pipe(withLoading(this.loadingService))
      .subscribe((updatedProduct: any) => {
        this.loadProducts();
        this.form.reset();
        this.formMode = 'create';
      });
  }

  deleteProduct(id: string) {
    this.loadingService.show();
    this.productService
      .delete(id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {
        this.loadProducts();
      });
  }
}
