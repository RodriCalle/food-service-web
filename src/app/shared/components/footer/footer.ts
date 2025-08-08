import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  imports: [MatIconModule, MatDivider],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  openSocial(url: string) {
    window.open(url, '_blank');
  }
}
