import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../task.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskResponseDTO } from '../../../shared/models/taskmanager.models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Tasks</h1>
        <button mat-flat-button color="primary" (click)="openTaskDialog()">
          <mat-icon>add</mat-icon>
          New Task
        </button>
      </div>

      <div *ngIf="taskService.loading()" class="flex justify-center items-center min-h-[60vh]">
        <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
      </div>

      <div *ngIf="!taskService.loading() && taskService.tasks().length === 0" class="text-center p-8 text-gray-500">
        No tasks found. Create one to get started!
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <mat-card *ngFor="let task of taskService.tasks()" class="hover:shadow-lg transition-shadow">
          <mat-card-header>
            <div mat-card-avatar class="flex items-center">
              <mat-checkbox 
                [checked]="task.completed" 
                (change)="toggleTaskCompletion(task)"
                color="primary">
              </mat-checkbox>
            </div>
            <mat-card-title [class.line-through]="task.completed">{{ task.title }}</mat-card-title>
            <mat-card-subtitle>{{ task.dueDate | date:'mediumDate' }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="mt-2">
            <p class="text-gray-600 line-clamp-3">{{ task.description || 'No description provided.' }}</p>
            <div class="mt-4 flex gap-2 flex-wrap">
              <mat-chip-set>
                <mat-chip [color]="getPriorityColor(task.priority)" selected>
                  {{ task.priority }}
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-icon-button (click)="openTaskDialog(task)" title="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteTask(task)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .line-through {
      text-decoration: line-through;
      color: rgba(0,0,0,0.5);
    }
  `]
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.taskService.list().subscribe();
  }

  getPriorityColor(priority?: string): string {
    switch (priority) {
      case 'CRITICAL': return 'warn';
      case 'HIGH': return 'warn';
      case 'MEDIUM': return 'accent';
      default: return '';
    }
  }

  toggleTaskCompletion(task: TaskResponseDTO) {
    if (task.completed) {
      this.taskService.reopen(task.id).subscribe();
    } else {
      this.taskService.complete(task.id).subscribe();
    }
  }

  openTaskDialog(task?: TaskResponseDTO) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.taskService.update(task.id, result).subscribe({
            next: () => this.snackBar.open('Task updated', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Error updating task', 'Close', { duration: 3000 })
          });
        } else {
          this.taskService.create(result).subscribe({
            next: () => this.snackBar.open('Task created', 'Close', { duration: 2000 }),
            error: () => this.snackBar.open('Error creating task', 'Close', { duration: 3000 })
          });
        }
      }
    });
  }

  deleteTask(task: TaskResponseDTO) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.delete(task.id).subscribe({
        next: () => this.snackBar.open('Task deleted', 'Close', { duration: 2000 }),
        error: () => this.snackBar.open('Error deleting task', 'Close', { duration: 3000 })
      });
    }
  }
}
