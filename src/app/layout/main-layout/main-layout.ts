import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '@src/app/shared/components/toolbar/toolbar';
import { SidenavComponent } from '@src/app/shared/components/sidenav/sidenav';
import { FooterComponent } from '@src/app/shared/components/footer/footer';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    ToolbarComponent,
    MatSidenavModule,
    SidenavComponent,
    FooterComponent,
    MatDividerModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {}
