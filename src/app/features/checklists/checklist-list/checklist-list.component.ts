import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ChecklistService } from '../checklist.service';
import { ChecklistDialogComponent } from '../checklist-dialog/checklist-dialog.component';
import { ChecklistResponseDTO } from '../../../shared/models/taskmanager.models';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Checklists</h1>
        <button mat-flat-button color="primary" (click)="openChecklistDialog()">
          <mat-icon>add</mat-icon>
          New Checklist
        </button>
      </div>

      <div *ngIf="checklistService.loading()" class="flex justify-center items-center min-h-[60vh]">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      </div>

      <div *ngIf="!checklistService.loading() && checklistService.checklists().length === 0" class="text-center p-8 text-gray-500">
        No checklists found. Create one to organize your tasks!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <mat-card *ngFor="let checklist of checklistService.checklists()" class="hover:shadow-lg transition-shadow">
          <mat-card-header>
            <mat-card-title>{{ checklist.title }}</mat-card-title>
            <mat-card-subtitle>Created on {{ checklist.createdAt | date:'mediumDate' }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="mt-2">
            <p class="text-gray-600 line-clamp-2">{{ checklist.description || 'No description provided.' }}</p>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button color="primary" [routerLink]="['/checklists', checklist.id]">
              VIEW TASKS
            </button>
            <button mat-icon-button (click)="openChecklistDialog(checklist)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteChecklist(checklist)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `
})
export class ChecklistListComponent implements OnInit {
  checklistService = inject(ChecklistService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.checklistService.list().subscribe();
  }

  openChecklistDialog(checklist?: ChecklistResponseDTO) {
    const dialogRef = this.dialog.open(ChecklistDialogComponent, {
      width: '500px',
      data: { checklist }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (checklist) {
          this.checklistService.update(checklist.id, result).subscribe({
            next: () => this.snackBar.open('Checklist updated', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Error updating checklist', 'Close', { duration: 3000 })
          });
        } else {
          this.checklistService.create(result).subscribe({
            next: () => this.snackBar.open('Checklist created', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Error creating checklist', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  deleteChecklist(checklist: ChecklistResponseDTO) {
    if (confirm(`Are you sure you want to delete "${checklist.title}"? This will NOT delete the tasks associated with it.`)) {
      this.checklistService.delete(checklist.id).subscribe({
        next: () => this.snackBar.open('Checklist deleted', 'Close', { duration: 2000 }),
        error: () => this.snackBar.open('Error deleting checklist', 'Close', { duration: 3000 })
      });
    }
  }
}
