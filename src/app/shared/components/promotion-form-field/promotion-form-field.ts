import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PromotionService } from '@src/app/core/services/promotion-service';
import { LoadingService } from '../../services/loading-service';
import { map, Observable, startWith } from 'rxjs';
import { withLoading } from '../../operators/with-loading';

@Component({
  selector: 'app-promotion-form-field',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    AsyncPipe,],
  templateUrl: './promotion-form-field.html',
  styleUrl: './promotion-form-field.scss'
})
export class PromotionFormField implements OnInit {
  @Input({ required: true }) control!: FormControl;
  @Input() isRequired = false;
  @Input() restaurantId!: string | null;

  @Output() promotionSelected = new EventEmitter<any>();

  private readonly promotionService = inject(PromotionService);
  private readonly loadingService = inject(LoadingService);

  promotions: any[] = [];
  filteredPromotions$!: Observable<any[]>;

  ngOnInit() {
    this.loadPromotions();

    this.filteredPromotions$ = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterPromotion(value))
    );
  }

  loadPromotions() {
    this.loadingService.show();
    this.promotionService
      .getAll(this.restaurantId ?? undefined)
      .pipe(withLoading(this.loadingService))
      .subscribe((promotions) => {
        this.promotions = promotions;
      });
  }

  displayPromotionName(promotion: any): string {
    return promotion ? promotion.name : '';
  }

  private _filterPromotion(value: any): any[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : this.displayPromotionName(value).toLowerCase();

    return this.promotions.filter((promotion) =>
      promotion.name.toLowerCase().includes(filterValue)
    );
  }

  onPromotionSelected(product: any) {
    this.promotionSelected.emit(product);
  }

}
