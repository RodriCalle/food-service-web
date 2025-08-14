import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@src/app/core/services/auth-service';
import { PromotionService } from '@src/app/core/services/promotion-service';
import { LoadingComponent } from "@src/app/shared/components/loading/loading";
import { LoadingService } from '@src/app/shared/services/loading-service';
import { RestaurantFormField } from "@src/app/shared/components/restaurant-form-field/restaurant-form-field";
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { Observable } from 'rxjs';
import { Promotion } from '@src/app/core/models/promotion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-list-promotion',
  imports: [LoadingComponent, RestaurantFormField,
    LoadingComponent,
    AsyncPipe,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './list-promotion.html',
  styleUrl: './list-promotion.scss'
})
export class ListPromotionComponent implements OnInit, AfterViewInit {
  private readonly promotionService = inject(PromotionService);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = this.loadingService.isLoading;
  filterForm = this.formBuilder.group({
    restaurantId: this.formBuilder.control({ value: null, disabled: !this.authService.hasRole(['Admin']) }),
  });
  promotions$!: Observable<Promotion[]>;
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'restaurant',
    'products',
    'actions',
  ];
  public dataSource = new MatTableDataSource<Promotion>([]);

  ngOnInit(): void {
    const restaurantId = this.authService.getUserInfo().restaurantId;
    this.filterForm.controls.restaurantId.setValue(restaurantId);

    this.loadPromotions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadPromotions() {
    const { restaurantId } = this.filterForm.getRawValue();
    this.loadingService.show();

    this.promotionService
      .getAll(
        restaurantId ?? undefined,
      )
      .pipe(withLoading(this.loadingService))
      .subscribe((response) => {
        this.dataSource.data = response;
      });
  }

  deletePromotion(id: string) {
    this.loadingService.show();
    this.promotionService
      .delete(id)
      .pipe(withLoading(this.loadingService))
      .subscribe(() => {
        this.loadPromotions();
      });
  }
}
