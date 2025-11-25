import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  
  // Cache cho danh sách classrooms
  private classroomsCache: Classroom[] | null = null;
  // Cache cho từng classroom theo ID
  private classroomCache: Map<number, Classroom> = new Map();

  getAllClassrooms(): Observable<ClassroomResponse> {
    // Nếu đã có cache, return ngay
    if (this.classroomsCache) {
      return of({
        success: true,
        message: 'Loaded from cache',
        classrooms: this.classroomsCache
      });
    }

    // Chưa có cache, gọi API và lưu vào cache
    return this.http.get<ClassroomResponse>(this.apiUrl).pipe(
      tap(res => {
        if (res && res.success && res.classrooms) {
          this.classroomsCache = res.classrooms;
        }
      })
    );
  }

  getClassroomById(id: number): Observable<ClassroomResponse> {
    // Kiểm tra cache trước
    if (this.classroomCache.has(id)) {
      return of({
        success: true,
        message: 'Loaded from cache',
        classroom: this.classroomCache.get(id)!
      });
    }

    // Chưa có cache, gọi API và lưu vào cache
    return this.http.get<ClassroomResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(res => {
        if (res && res.success && res.classroom) {
          this.classroomCache.set(id, res.classroom);
        }
      })
    );
  }

  // Method để clear cache (khi cần refresh data)
  clearCache(): void {
    this.classroomsCache = null;
    this.classroomCache.clear();
  }

  // Method để lấy cache trực tiếp (không gọi API)
  getClassroomsCache(): Classroom[] | null {
    return this.classroomsCache;
  }
}
