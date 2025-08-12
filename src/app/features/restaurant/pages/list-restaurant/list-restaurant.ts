import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Restaurant } from '@src/app/core/models/restaurant';
import { RestaurantService } from '@src/app/core/services/restaurant-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';

@Component({
  selector: 'app-list-restaurant',
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
    DatePipe,
  ],
  templateUrl: './list-restaurant.html',
  styleUrl: './list-restaurant.scss',
})
export class ListRestaurantComponent implements AfterViewInit, OnInit {
  private readonly restaurantService = inject(RestaurantService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formMode: 'create' | 'edit' = 'create';
  displayedColumns: string[] = [
    'id',
    'name',
    'address',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'status',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Restaurant>([]);
  isLoading = this.loadingService.isLoading;
  form = this.formBuilder.group({
    id: [''],
    name: [''],
    address: [''],
  });

  ngOnInit(): void {
    this.loadRestaurants();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  saveRestaurant() {
    if (this.formMode === 'create') {
      this.createRestaurant();
    } else {
      this.updateRestaurant();
    }
  }

  loadRestaurants() {
    this.loadingService.show();
    this.restaurantService
      .getAll()
      .pipe(withLoading(this.loadingService))
      .subscribe((restaurants: any[any]) => {
        this.dataSource.data = restaurants;
      });
  }

  cancelEditMode() {
    this.formMode = 'create';
    this.form.reset();
  }

  createRestaurant() {
    if (this.form.invalid) return;

    let restaurant = this.form.getRawValue() as Restaurant;

    this.loadingService.show();
    this.restaurantService
      .create(restaurant)
      .pipe(withLoading(this.loadingService))
      .subscribe((newRestaurant: any) => {
        this.form.reset();
        this.loadRestaurants();
      });
  }

  editRestaurant(category: any) {
    this.formMode = 'edit';
    this.form.patchValue(category);
  }

  updateRestaurant() {
    if (this.form.invalid) return;
    this.loadingService.show();

    let restaurant = this.form.getRawValue() as Restaurant;

    this.restaurantService
      .update(restaurant.id, restaurant)
      .pipe(withLoading(this.loadingService))
      .subscribe((updatedRestaurant: any) => {
        this.loadRestaurants();
        this.form.reset();
        this.formMode = 'create';
      });
  }

  deleteRestaurant(id: string) {
    this.loadingService.show();
    this.restaurantService
      .delete(id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {
        this.loadRestaurants();
      });
  }
}
