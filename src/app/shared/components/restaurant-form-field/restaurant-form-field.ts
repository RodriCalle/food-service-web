import { Observable } from 'rxjs';
import { Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RestaurantService } from '@src/app/core/services/restaurant-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { Restaurant } from '@src/app/core/models/restaurant';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-restaurant-form-field',
  imports: [MatInputModule, MatSelectModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './restaurant-form-field.html',
  styleUrl: './restaurant-form-field.scss',
})
export class RestaurantFormField {
  @Input({ required: true }) control!: FormControl;
  @Input() allAvailable: boolean = false;
  @Input() isRequired: boolean = false;

  private readonly restaurantService = inject(RestaurantService);
  private readonly loadingService = inject(LoadingService);
  restaurants$!: Observable<Restaurant[]>;

  constructor() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.loadingService.show();

    this.restaurants$ = this.restaurantService
      .getAll()
      .pipe(withLoading(this.loadingService));
  }
}
