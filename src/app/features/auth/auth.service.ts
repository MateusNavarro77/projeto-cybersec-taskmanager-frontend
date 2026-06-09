import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  AuthResponseDTO, 
  LoginRequestDTO, 
  RegisterRequestDTO, 
  UserResponseDTO 
} from '../../shared/models/taskmanager.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // State
  private _user = signal<UserResponseDTO | null>(null);
  
  // Public signals
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._user() || !!localStorage.getItem('token'));

  constructor() {
    if (localStorage.getItem('token')) {
      this.fetchMe().subscribe();
    }
  }

  login(credentials: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.fetchMe().subscribe();
      })
    );
  }

  register(data: RegisterRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/register`, data);
  }

  fetchMe(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/me`).pipe(
      tap(user => this._user.set(user))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }
}
