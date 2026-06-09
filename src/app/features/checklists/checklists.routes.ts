import { Routes } from '@angular/router';
import { ChecklistListComponent } from './checklist-list/checklist-list.component';
import { ChecklistDetailComponent } from './checklist-detail/checklist-detail.component';

export const CHECKLIST_ROUTES: Routes = [
  { path: '', component: ChecklistListComponent },
  { path: ':id', component: ChecklistDetailComponent }
];
