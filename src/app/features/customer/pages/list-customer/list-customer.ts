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
import { Customer } from '@src/app/core/models/customer';
import { CustomerService } from '@src/app/core/services/customer-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';

@Component({
  selector: 'app-list-customer',
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
  templateUrl: './list-customer.html',
  styleUrl: './list-customer.scss',
})
export class ListCustomerComponent implements AfterViewInit, OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formMode: 'create' | 'edit' = 'create';
  displayedColumns: string[] = [
    'id',
    'name',
    'lastName',
    'documentNumber',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Customer>([]);
  isLoading = this.loadingService.isLoading;
  form = this.formBuilder.group({
    id: [''],
    name: [''],
    lastName: [''],
    documentNumber: [''],
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  saveCustomer() {
    if (this.formMode === 'create') {
      this.createCustomer();
    } else {
      this.updateCustomer();
    }
  }

  loadCustomers() {
    this.loadingService.show();
    this.customerService
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

  createCustomer() {
    if (this.form.invalid) return;

    let category = this.form.getRawValue() as Customer;

    this.loadingService.show();
    this.customerService
      .create(category)
      .pipe(withLoading(this.loadingService))
      .subscribe((newCustomer: any) => {
        this.form.reset();
        this.loadCustomers();
      });
  }

  editCustomer(customer: any) {
    this.formMode = 'edit';
    this.form.patchValue(customer);
  }

  updateCustomer() {
    if (this.form.invalid) return;
    this.loadingService.show();

    let customer = this.form.getRawValue() as Customer;

    this.customerService
      .update(customer.id, customer)
      .pipe(withLoading(this.loadingService))
      .subscribe((updatedCustomer: any) => {
        this.loadCustomers();
        this.form.reset();
        this.formMode = 'create';
      });
  }

  deleteCustomer(id: string) {
    this.loadingService.show();
    this.customerService
      .delete(id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {
        this.loadCustomers();
      });
  }
}
