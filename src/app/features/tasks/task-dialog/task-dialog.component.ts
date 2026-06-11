import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskResponseDTO } from '../../../shared/models/taskmanager.models';

@Component({
  selector: 'app-task-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.task ? 'Edit Task' : 'New Task' }}</h2>
    <mat-dialog-content class="!py-4">
      <form [formGroup]="taskForm" class="flex flex-col gap-4 mt-2">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Task title">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">Title is required</mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">Max 120 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Task description"></textarea>
        </mat-form-field>

        <div class="flex gap-4">
          <mat-form-field appearance="outline" class="flex-grow">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Low</mat-option>
              <mat-option value="MEDIUM">Medium</mat-option>
              <mat-option value="HIGH">High</mat-option>
              <mat-option value="CRITICAL">Critical</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-grow">
            <mat-label>Due Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dueDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="taskForm.invalid" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data = inject<{ task?: TaskResponseDTO; checklistId?: string }>(MAT_DIALOG_DATA);

  taskForm = this.fb.group({
    title: [this.data.task?.title || '', [Validators.required, Validators.maxLength(120)]],
    description: [this.data.task?.description || ''],
    priority: [this.data.task?.priority || 'MEDIUM'],
    dueDate: [this.data.task?.dueDate ? new Date(this.data.task.dueDate) : null],
    checklistId: [this.data.task?.checklistId || this.data.checklistId || null]
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      // Convert date to ISO string if exists
      if (formValue.dueDate) {
        formValue.dueDate = (formValue.dueDate as any).toISOString();
      }
      this.dialogRef.close(formValue);
    }
  }
}
