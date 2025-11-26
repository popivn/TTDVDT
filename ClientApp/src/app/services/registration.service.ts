import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Registration {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  classroomId: number;
  classroomName: string;
  courseId: number;
  courseName: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  classroomId: number;
  courseId: number;
  note?: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration?: Registration;
  registrations?: Registration[];
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private http = inject(HttpClient);
  private apiUrl = 'api/registration';

  getAllRegistrations(): Observable<RegistrationResponse> {
    return this.http.get<RegistrationResponse>(this.apiUrl);
  }

  getRegistrationById(id: number): Observable<RegistrationResponse> {
    return this.http.get<RegistrationResponse>(`${this.apiUrl}/${id}`);
  }

  createRegistration(request: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.apiUrl, request);
  }

  deleteRegistration(id: number): Observable<RegistrationResponse> {
    return this.http.delete<RegistrationResponse>(`${this.apiUrl}/${id}`);
  }
}

