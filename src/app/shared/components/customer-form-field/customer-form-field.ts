import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from '@src/app/core/services/customer-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-customer-form-field',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './customer-form-field.html',
  styleUrl: './customer-form-field.scss',
})
export class CustomerFormField {
  @Input({ required: true }) control!: FormControl;
  @Input() isRequired = false;

  @Output() customerSelected = new EventEmitter<any>();

  private readonly customerService = inject(CustomerService);
  private readonly loadingService = inject(LoadingService);

  customers: any[] = [];
  filteredCustomers$!: Observable<any[]>;

  ngOnInit() {
    this.loadCustomers();

    this.filteredCustomers$ = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCustomer(value))
    );
  }

  loadCustomers() {
    this.loadingService.show();
    this.customerService
      .getAll()
      .pipe(withLoading(this.loadingService))
      .subscribe((customers) => {
        this.customers = customers;
      });
  }

  displayCustomerName(customer: any): string {
    return customer
      ? `${customer.name} ${customer.lastName} - ${customer.documentNumber}`
      : '';
  }

  private _filterCustomer(value: any): any[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : this.displayCustomerName(value).toLowerCase();

    return this.customers.filter((customer) =>
      `${customer.name} ${customer.lastName} - ${customer.documentNumber}`
        .toLowerCase()
        .includes(filterValue)
    );
  }

  onCustomerSelected(customer: any) {
    this.customerSelected.emit(customer);
  }
}
