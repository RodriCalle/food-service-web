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
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApplicationUser } from '@src/app/core/models/application-user';
import { ApplicationUserService } from '@src/app/core/services/application-user-service';
import { AuthService } from '@src/app/core/services/auth-service';
import { RoleService } from '@src/app/core/services/role-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { RestaurantFormField } from '@src/app/shared/components/restaurant-form-field/restaurant-form-field';

@Component({
  selector: 'app-list-application-user',
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
  ],
  templateUrl: './list-application-user.html',
  styleUrl: './list-application-user.scss',
})
export class ListApplicationUserComponent implements AfterViewInit, OnInit {
  parseRoles(roles: string[]) {
    return roles.join(',');
  }
  private readonly applicationUserService = inject(ApplicationUserService);
  private readonly authService = inject(AuthService);
  private readonly roleService = inject(RoleService);
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'userName',
    'role',
    'name',
    'lastName',
    'documentNumber',
    'restaurant',
    'email',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'status',
  ];
  public dataSource = new MatTableDataSource<ApplicationUser>([]);
  roles: any[] = [];
  isLoading = this.loadingService.isLoading;
  form = this.formBuilder.group({
    userName: [''],
    name: [''],
    lastName: [''],
    documentNumber: [''],
    restaurantId: [
      { value: null, disabled: !this.authService.hasRole(['Admin']) },
    ],
    email: [''],
    password: [''],
    role: [''],
  });
  filterForm = this.formBuilder.group({
    restaurantId: [
      { value: null, disabled: !this.authService.hasRole(['Admin']) },
    ],
  });

  ngOnInit(): void {
    this.loadRoles();

    const { restaurantId } = this.authService.getUserInfo();
    this.form.controls.restaurantId.setValue(restaurantId);
    this.filterForm.controls.restaurantId.setValue(restaurantId);

    this.loadApplicationUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  saveApplicationUser() {
    this.createApplicationUser();
  }

  loadApplicationUsers() {
    const { restaurantId } = this.filterForm.value;

    this.loadingService.show();
    this.applicationUserService
      .getAll(restaurantId ?? undefined)
      .pipe(withLoading(this.loadingService))
      .subscribe((categories: any[any]) => {
        this.dataSource.data = categories;
      });
  }

  loadRoles() {
    this.loadingService.show();
    this.roleService
      .getAll()
      .pipe(withLoading(this.loadingService))
      .subscribe((roles: any[any]) => {
        this.roles = roles;
      });
  }

  createApplicationUser() {
    if (this.form.invalid) return;

    let applicationUser = this.form.value as ApplicationUser;

    this.loadingService.show();
    this.authService
      .create(applicationUser)
      .pipe(withLoading(this.loadingService))
      .subscribe((newApplicationUser: any) => {
        this.form.reset();
        this.loadApplicationUsers();
      });
  }

  // TODO: change status of orders
  // TODO: implement promos
  // TODO: implement dashboard with statistics
  // TODO: change password on profile view
  // TODO: update application user on profile view
}
