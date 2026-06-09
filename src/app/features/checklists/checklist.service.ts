import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChecklistRequestDTO, ChecklistResponseDTO, TaskResponseDTO } from '../../shared/models/taskmanager.models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/checklists`;

  // State
  private _checklists = signal<ChecklistResponseDTO[]>([]);
  private _loading = signal<boolean>(false);

  // Public signals
  checklists = computed(() => this._checklists());
  loading = computed(() => this._loading());

  list(): Observable<ChecklistResponseDTO[]> {
    this._loading.set(true);
    return this.http.get<ChecklistResponseDTO[]>(this.apiUrl).pipe(
      tap(checklists => {
        this._checklists.set(checklists);
        this._loading.set(false);
      })
    );
  }

  getById(id: string): Observable<ChecklistResponseDTO> {
    return this.http.get<ChecklistResponseDTO>(`${this.apiUrl}/${id}`);
  }

  create(checklist: ChecklistRequestDTO): Observable<ChecklistResponseDTO> {
    return this.http.post<ChecklistResponseDTO>(this.apiUrl, checklist).pipe(
      tap(newChecklist => {
        this._checklists.update(list => [newChecklist, ...list]);
      })
    );
  }

  update(id: string, checklist: ChecklistRequestDTO): Observable<ChecklistResponseDTO> {
    return this.http.put<ChecklistResponseDTO>(`${this.apiUrl}/${id}`, checklist).pipe(
      tap(updatedChecklist => {
        this._checklists.update(list => list.map(c => c.id === id ? updatedChecklist : c));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._checklists.update(list => list.filter(c => c.id !== id));
      })
    );
  }

  listTasks(id: string): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/${id}/tasks`);
  }
}
