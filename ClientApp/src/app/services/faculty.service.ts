import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Faculty {
  id: number;
  facultyName: string;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  description?: string;
}

export interface FacultyResponse {
  success: boolean;
  message: string;
  faculties?: Faculty[];
  faculty?: Faculty;
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private http = inject(HttpClient);
  private apiUrl = 'api/faculty';

  getAllFaculties(): Observable<FacultyResponse> {
    return this.http.get<FacultyResponse>(this.apiUrl);
  }

  getFacultyById(id: number): Observable<FacultyResponse> {
    return this.http.get<FacultyResponse>(`${this.apiUrl}/${id}`);
  }
}

