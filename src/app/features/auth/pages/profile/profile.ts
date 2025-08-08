import { ApplicationUser } from '@app/core/models/application-user';
import { Component, inject, signal } from '@angular/core';
import { ApplicationUserService } from '@src/app/core/services/application-user-service';
import { AuthService } from '@src/app/core/services/auth-service';
import { withLoading } from '@src/app/shared/operators/with-loading';
import { LoadingService } from '@src/app/shared/services/loading-service';
import { LoadingComponent } from '@src/app/shared/components/loading/loading';

@Component({
  selector: 'app-profile',
  imports: [LoadingComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent {
  private readonly title = 'My Profile';
  private readonly authService = inject(AuthService);
  private readonly applicationUserService = inject(ApplicationUserService);
  private readonly loadingService = inject(LoadingService);

  userInfo = this.authService.getUserInfo();
  userSignal = signal<ApplicationUser>({} as ApplicationUser);
  isLoading = this.loadingService.isLoading;

  constructor() {
    this.loadingService.show();
    this.applicationUserService
      .getById(this.userInfo?.id)
      .pipe(withLoading(this.loadingService))
      .subscribe((user: any) => {
        this.userSignal.set(user);
      });
  }
}
