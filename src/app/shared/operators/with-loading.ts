import { LoadingService } from '@src/app/shared/services/loading-service';
import { finalize, Observable } from 'rxjs';

export function withLoading(loadingService: LoadingService) {
  return function <T>(source$: Observable<T>) {
    loadingService.show();
    return source$.pipe(finalize(() => loadingService.hide()));
  };
}
