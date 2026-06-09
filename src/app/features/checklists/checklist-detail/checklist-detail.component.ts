import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChecklistService } from '../checklist.service';
import { TaskService } from '../../tasks/task.service';
import { TaskDialogComponent } from '../../tasks/task-dialog/task-dialog.component';
import { ChecklistResponseDTO, TaskResponseDTO } from '../../../shared/models/taskmanager.models';

@Component({
  selector: 'app-checklist-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="p-4">
      <div class="mb-6">
        <button mat-button routerLink="/checklists">
          <mat-icon>arrow_back</mat-icon>
          Back to Checklists
        </button>
      </div>

      <div *ngIf="loading()" class="flex justify-center p-8">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div *ngIf="!loading() && checklist()" class="mb-8">
        <h1 class="text-3xl font-bold">{{ checklist()?.title }}</h1>
        <p class="text-gray-600 mt-2">{{ checklist()?.description || 'No description provided.' }}</p>
        
        <div class="flex justify-between items-center mt-8">
          <h2 class="text-xl font-semibold">Tasks in this checklist</h2>
          <button mat-flat-button color="primary" (click)="openTaskDialog()">
            <mat-icon>add</mat-icon>
            Add Task
          </button>
        </div>

        <div *ngIf="tasks().length === 0" class="text-center p-8 text-gray-500 bg-surface-container mt-4 rounded-lg">
          No tasks in this checklist yet.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <mat-card *ngFor="let task of tasks()" class="hover:shadow-md transition-shadow">
            <mat-card-header>
              <div mat-card-avatar>
                <mat-checkbox 
                  [checked]="task.completed" 
                  (change)="toggleTaskCompletion(task)"
                  color="primary">
                </mat-checkbox>
              </div>
              <mat-card-title [class.line-through]="task.completed">{{ task.title }}</mat-card-title>
              <mat-card-subtitle>{{ task.dueDate | date:'mediumDate' }}</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-actions align="end">
              <button mat-icon-button (click)="openTaskDialog(task)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
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
export class ChecklistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private checklistService = inject(ChecklistService);
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  checklist = signal<ChecklistResponseDTO | null>(null);
  tasks = signal<TaskResponseDTO[]>([]);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: string) {
    this.loading.set(true);
    this.checklistService.getById(id).subscribe(c => {
      this.checklist.set(c);
      this.loadTasks(id);
    });
  }

  loadTasks(id: string) {
    this.checklistService.listTasks(id).subscribe(tasks => {
      this.tasks.set(tasks);
      this.loading.set(false);
    });
  }

  toggleTaskCompletion(task: TaskResponseDTO) {
    if (task.completed) {
      this.taskService.reopen(task.id).subscribe(updated => {
        this.tasks.update(ts => ts.map(t => t.id === task.id ? updated : t));
      });
    } else {
      this.taskService.complete(task.id).subscribe(updated => {
        this.tasks.update(ts => ts.map(t => t.id === task.id ? updated : t));
      });
    }
  }

  openTaskDialog(task?: TaskResponseDTO) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task, checklistId: this.checklist()?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (task) {
          this.taskService.update(task.id, result).subscribe({
            next: (updated) => {
              this.tasks.update(ts => ts.map(t => t.id === task.id ? updated : t));
              this.snackBar.open('Task updated', 'Close', { duration: 2000 });
            }
          });
        } else {
          this.taskService.create(result).subscribe({
            next: (newT) => {
              this.tasks.update(ts => [newT, ...ts]);
              this.snackBar.open('Task added', 'Close', { duration: 2000 });
            }
          });
        }
      }
    });
  }

  deleteTask(task: TaskResponseDTO) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.delete(task.id).subscribe(() => {
        this.tasks.update(ts => ts.filter(t => t.id !== task.id));
        this.snackBar.open('Task removed', 'Close', { duration: 2000 });
      });
    }
  }
}
