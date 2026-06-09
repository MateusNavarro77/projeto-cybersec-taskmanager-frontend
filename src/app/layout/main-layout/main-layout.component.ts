import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../features/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="flex flex-col h-screen">
      <mat-toolbar color="primary" class="flex justify-between">
        <div class="flex items-center">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>Task Manager</span>
        </div>
        
        <div class="flex items-center gap-4">
          <span *ngIf="authService.user() as user" class="hidden sm:inline">
            Hello, {{ user.username }}
          </span>
          <button mat-icon-button (click)="authService.logout()" title="Logout">
            <mat-icon>logout</mat-icon>
          </button>
        </div>
      </mat-toolbar>

      <mat-sidenav-container class="flex-grow">
        <mat-sidenav #sidenav mode="side" opened class="w-64 bg-surface-container">
          <mat-nav-list>
            <a mat-list-item routerLink="/tasks" routerLinkActive="bg-secondary-container">
              <mat-icon matListItemIcon>task</mat-icon>
              <div matListItemTitle>Tasks</div>
            </a>
            <a mat-list-item routerLink="/checklists" routerLinkActive="bg-secondary-container">
              <mat-icon matListItemIcon>checklist</mat-icon>
              <div matListItemTitle>Checklists</div>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="p-4 bg-surface">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .mat-sidenav {
      border-right: 1px solid var(--mat-sys-outline-variant);
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
}
