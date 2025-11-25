import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Course {
  id: number;
  name: string;
  duration: number; // Số tiết
  tuition: number;
  classId: number; // ID của lớp học (classroom)
  createdAt?: string;
  updatedAt?: string;
  classroom?: {
    id: number;
    classroomName: string;
    description?: string;
    capacity?: number;
    imageUrl?: string;
  };
}

export interface CourseResponse {
  success: boolean;
  message: string;
  courses?: Course[];
  course?: Course;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private http = inject(HttpClient);
  private apiUrl = 'api/course';
  
  // Cache Observable thay vì cache data để đảm bảo luôn return cùng Observable instance
  private coursesObservables: Map<number, Observable<Course[]>> = new Map();

  getAllCourses(): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(this.apiUrl);
  }

  getCourseById(id: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.apiUrl}/${id}`);
  }

  getCoursesByClassId(classId: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.apiUrl}/class/${classId}`);
  }

  /**
   * Lấy courses theo classId với cache Observable
   * Cache Observable thay vì cache data để đảm bảo luôn return cùng Observable instance
   * Điều này ngăn async pipe unsubscribe/subscribe lại → tránh chớp nháy
   */
  getCoursesByClassIdCached(classId: number): Observable<Course[]> {
    // Nếu đã có Observable trong cache, return nó (cùng instance)
    if (this.coursesObservables.has(classId)) {
      return this.coursesObservables.get(classId)!;
    }

    // Tạo Observable mới và cache nó
    const observable$ = this.getCoursesByClassId(classId).pipe(
      map(response => {
        if (response.success && response.courses) {
          return response.courses;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error loading courses for classId:', classId, error);
        return of([]);
      }),
      shareReplay(1) // Cache giá trị cuối cùng và share cho multiple subscribers
    );

    // Cache Observable để dùng lại
    this.coursesObservables.set(classId, observable$);
    
    return observable$;
  }

  /**
   * Clear cache cho một classId cụ thể hoặc toàn bộ cache
   */
  clearCache(classId?: number): void {
    if (classId) {
      this.coursesObservables.delete(classId);
    } else {
      this.coursesObservables.clear();
    }
  }

  createCourse(course: Partial<Course>): Observable<CourseResponse> {
    return this.http.post<CourseResponse>(this.apiUrl, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<CourseResponse> {
    return this.http.delete<CourseResponse>(`${this.apiUrl}/${id}`);
  }
}

