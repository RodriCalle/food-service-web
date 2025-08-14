import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
import { authGuard } from '@src/app/core/guards/auth-guard';
import { unauthGuard } from '@src/app/core/guards/unauth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [unauthGuard],
    canActivateChild: [unauthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/auth/pages/profile/profile').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/welcome/welcome').then(
            (m) => m.WelcomeComponent
          ),
      },
      {
        path: 'application-users',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import(
                './features/application-user/pages/list-application-user/list-application-user'
              ).then((m) => m.ListApplicationUserComponent),
          },
        ],
      },
      {
        path: 'restaurants',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import(
                './features/restaurant/pages/list-restaurant/list-restaurant'
              ).then((m) => m.ListRestaurantComponent),
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./features/order/pages/list-order/list-order').then(
                (m) => m.ListOrderComponent
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./features/order/pages/create-order/create-order').then(
                (m) => m.CreateOrderComponent
              ),
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import(
                './features/customer/pages/list-customer/list-customer'
              ).then((m) => m.ListCustomerComponent),
          },
        ],
      },
      {
        path: 'categories',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import(
                './features/category/pages/list-category/list-category'
              ).then((m) => m.ListCategoryComponent),
          },
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./features/product/pages/list-product/list-product').then(
                (m) => m.ListProductComponent
              ),
          },
        ],
      },
      {
        path: 'promotions',
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./features/promotion/pages/list-promotion/list-promotion').then(
                (m) => m.ListPromotionComponent
              ),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./features/promotion/pages/create-promotion/create-promotion').then(
                (m) => m.CreatePromotionComponent
              ),
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
