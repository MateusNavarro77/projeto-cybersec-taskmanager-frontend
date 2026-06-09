import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskRequestDTO, TaskResponseDTO } from '../../shared/models/taskmanager.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tasks`;

  // State
  private _tasks = signal<TaskResponseDTO[]>([]);
  private _loading = signal<boolean>(false);

  // Public signals
  tasks = computed(() => this._tasks());
  loading = computed(() => this._loading());

  list(filters: { completed?: boolean; priority?: string; checklistId?: string } = {}): Observable<TaskResponseDTO[]> {
    this._loading.set(true);
    let params = new HttpParams();
    if (filters.completed !== undefined) params = params.set('completed', filters.completed);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.checklistId) params = params.set('checklistId', filters.checklistId);

    return this.http.get<TaskResponseDTO[]>(this.apiUrl, { params }).pipe(
      tap(tasks => {
        this._tasks.set(tasks);
        this._loading.set(false);
      })
    );
  }

  create(task: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.post<TaskResponseDTO>(this.apiUrl, task).pipe(
      tap(newTask => {
        this._tasks.update(tasks => [newTask, ...tasks]);
      })
    );
  }

  update(id: string, task: TaskRequestDTO): Observable<TaskResponseDTO> {
    return this.http.put<TaskResponseDTO>(`${this.apiUrl}/${id}`, task).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._tasks.update(tasks => tasks.filter(t => t.id !== id));
      })
    );
  }

  complete(id: string): Observable<TaskResponseDTO> {
    return this.http.patch<TaskResponseDTO>(`${this.apiUrl}/${id}/complete`, {}).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  reopen(id: string): Observable<TaskResponseDTO> {
    return this.http.patch<TaskResponseDTO>(`${this.apiUrl}/${id}/reopen`, {}).pipe(
      tap(updatedTask => {
        this._tasks.update(tasks => tasks.map(t => t.id === id ? updatedTask : t));
      })
    );
  }

  listOrphans(): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(`${this.apiUrl}/orphan`);
  }
}
