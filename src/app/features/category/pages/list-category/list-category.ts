import { Category } from '@src/app/core/models/category';
import { CategoryService } from './../../../../core/services/category-service';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthService } from '@src/app/core/services/auth-service';

@Component({
  selector: 'app-list-category',
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
  templateUrl: './list-category.html',
  styleUrl: './list-category.scss',
})
export class ListCategoryComponent implements AfterViewInit, OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  editIsDisabled: boolean = true;
  deleteIsDisabled: boolean = true;

  formMode: 'create' | 'edit' = 'create';
  displayedColumns: string[] = [
    'id',
    'name',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'status',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Category>([]);
  isLoading = this.loadingService.isLoading;
  form = this.formBuilder.group({
    id: [''],
    name: [''],
  });

  ngOnInit(): void {
    this.editIsDisabled = !this.authService.hasRole(['Admin']);
    this.deleteIsDisabled = !this.authService.hasRole(['Admin']);
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  saveCategory() {
    if (this.formMode === 'create') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  loadCategories() {
    this.loadingService.show();
    this.categoryService
      .getAll()
      .pipe(withLoading(this.loadingService))
      .subscribe((categories: any[any]) => {
        this.dataSource.data = categories;
      });
  }

  cancelEditMode() {
    this.formMode = 'create';
    this.form.reset();
  }

  createCategory() {
    if (this.form.invalid) return;

    let category = this.form.getRawValue() as Category;

    this.loadingService.show();
    this.categoryService
      .create(category)
      .pipe(withLoading(this.loadingService))
      .subscribe((newCategory: any) => {
        this.form.reset();
        this.loadCategories();
      });
  }

  editCategory(category: any) {
    this.formMode = 'edit';
    this.form.patchValue(category);
  }

  updateCategory() {
    if (this.form.invalid) return;
    this.loadingService.show();

    let category = this.form.getRawValue() as Category;

    this.categoryService
      .update(category.id, category)
      .pipe(withLoading(this.loadingService))
      .subscribe((updatedCategory: any) => {
        this.loadCategories();
        this.form.reset();
        this.formMode = 'create';
      });
  }

  deleteCategory(id: string) {
    this.loadingService.show();
    this.categoryService
      .delete(id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {
        this.loadCategories();
      });
  }
}
