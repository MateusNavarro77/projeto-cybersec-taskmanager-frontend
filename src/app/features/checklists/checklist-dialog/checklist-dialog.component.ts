import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChecklistResponseDTO } from '../../../shared/models/taskmanager.models';

@Component({
  selector: 'app-checklist-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.checklist ? 'Edit Checklist' : 'New Checklist' }}</h2>
    <mat-dialog-content class="!py-4">
      <form [formGroup]="checklistForm" class="flex flex-col gap-4 mt-2">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Checklist title">
          <mat-error *ngIf="checklistForm.get('title')?.hasError('required')">Title is required</mat-error>
          <mat-error *ngIf="checklistForm.get('title')?.hasError('maxlength')">Max 120 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Checklist description"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="checklistForm.invalid" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `
})
export class ChecklistDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ChecklistDialogComponent>);
  data = inject<{ checklist?: ChecklistResponseDTO }>(MAT_DIALOG_DATA);

  checklistForm = this.fb.group({
    title: [this.data.checklist?.title || '', [Validators.required, Validators.maxLength(120)]],
    description: [this.data.checklist?.description || '']
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.checklistForm.valid) {
      this.dialogRef.close(this.checklistForm.value);
    }
  }
}
