import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@src/app/core/services/auth-service';

interface MenuItemChild {
  label: string;
  path: string;
  roles: string[];
}

interface MenuItem {
  label: string;
  icon: string;
  children: MenuItemChild[];
}

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class SidenavComponent {
  private readonly authService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: 'Usuarios',
      icon: 'support_agent',
      children: [
        {
          label: 'Listado',
          path: '/application-users/list',
          roles: ['admin', 'supervisor'],
        },
      ],
    },
    {
      label: 'Restaurante',
      icon: 'restaurant',
      children: [
        { label: 'Listado', path: '/restaurants/list', roles: ['admin'] },
      ],
    },
    {
      label: 'Pedidos',
      icon: 'room_service',
      children: [
        {
          label: 'Listado',
          path: '/orders/list',
          roles: ['admin', 'supervisor', 'waiter', 'cook'],
        },
        {
          label: 'Crear',
          path: '/orders/create',
          roles: ['admin', 'supervisor', 'waiter'],
        },
      ],
    },
    {
      label: 'Cliente',
      icon: 'people',
      children: [
        {
          label: 'Listado',
          path: '/customers/list',
          roles: ['admin', 'supervisor', 'waiter'],
        },
      ],
    },
    {
      label: 'Categorías',
      icon: 'category',
      children: [
        {
          label: 'Listado',
          path: '/categories/list',
          roles: ['admin', 'supervisor'],
        },
      ],
    },
    {
      label: 'Productos',
      icon: 'fastfood',
      children: [
        {
          label: 'Listado',
          path: '/products/list',
          roles: ['admin', 'supervisor'],
        },
      ],
    },
  ];
  menuItemsForRole: MenuItem[] = [];

  constructor() {
    let role = this.authService.getUserInfo()?.role || '';
    console.log('role', role);
    this.menuItemsForRole = this.getMenuItemsForRole(role);
  }

  getMenuItemsForRole(role: string): MenuItem[] {
    const lowerRole = role.toLowerCase();

    return this.menuItems
      .map((item) => ({
        ...item,
        children: item.children.filter((child) =>
          child.roles.map((r) => r.toLowerCase()).includes(lowerRole)
        ),
      }))
      .filter((item) => item.children.length > 0);
  }
}
