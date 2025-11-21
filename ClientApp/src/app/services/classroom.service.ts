import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classroom {
  id: number;
  classroomName: string;
  description?: string;
  capacity?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassroomResponse {
  success: boolean;
  message: string;
  classrooms?: Classroom[];
  classroom?: Classroom;
}

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private http = inject(HttpClient);
  private apiUrl = 'api/classroom';

  getAllClassrooms(): Observable<ClassroomResponse> {
    return this.http.get<ClassroomResponse>(this.apiUrl);
  }

  getClassroomById(id: number): Observable<ClassroomResponse> {
    return this.http.get<ClassroomResponse>(`${this.apiUrl}/${id}`);
  }
}
