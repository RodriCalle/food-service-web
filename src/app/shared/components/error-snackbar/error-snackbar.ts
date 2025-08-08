import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snackbar',
  imports: [],
  templateUrl: './error-snackbar.html',
  styles: ``,
})
export class ErrorSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { status: number; error: string }
  ) {}

  message = 'Ocurrió un error inesperado';

  getMessage(): string {
    if (this.data.status === 0) {
      return 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
    }
    return `${this.data.status} - ${this.data.error}`;
  }
}
