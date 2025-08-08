import { AuthService } from '@src/app/core/services/auth-service';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '@src/app/core/services/restaurant-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { Observable } from 'rxjs';
import { Restaurant } from '@src/app/core/models/restaurant';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSliderModule,
    RouterModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class ToolbarComponent implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly restaurantService = inject(RestaurantService);
  private readonly loadingService = inject(LoadingService);
  restaurant$: Observable<Restaurant> = new Observable();
  username: string | null = null;

  ngOnInit(): void {
    const { name, role, restaurantId } = this.authService.getUserInfo();
    this.username = `${name} - ${role}`;

    this.loadingService.show();
    this.restaurant$ = this.restaurantService
      .getById(restaurantId)
      .pipe(withLoading(this.loadingService));
  }

  toggleMenu() {
    this.menuToggle.emit();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
