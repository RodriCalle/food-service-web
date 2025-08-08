import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '@src/app/core/models/category';
import { CategoryService } from '@src/app/core/services/category-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-form-field',
  imports: [MatInputModule, MatSelectModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './category-form-field.html',
  styleUrl: './category-form-field.scss',
})
export class CategoryFormField {
  @Input({ required: true }) control!: FormControl;
  @Input() allAvailable: boolean = false;
  @Input() isRequired: boolean = false;

  private readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  categories$!: Observable<Category[]>;

  constructor() {
    this.loadRestaurants();
  }

  loadRestaurants() {
    this.loadingService.show();

    this.categories$ = this.categoryService
      .getAll()
      .pipe(withLoading(this.loadingService));
  }
}
