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
  
  // Cache để lưu courses theo classId
  private coursesCache: Map<number, Course[]> = new Map();
  private loadingCourses: Set<number> = new Set();

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
   * Lấy courses theo classId với cache
   * Trả về Observable<Course[]> thay vì CourseResponse để dễ sử dụng
   */
  getCoursesByClassIdCached(classId: number): Observable<Course[]> {
    // Kiểm tra cache trước
    if (this.coursesCache.has(classId)) {
      return of(this.coursesCache.get(classId)!);
    }

    // Nếu đang load thì không load lại
    if (this.loadingCourses.has(classId)) {
      return of([]);
    }

    // Load từ API
    this.loadingCourses.add(classId);
    
    return this.getCoursesByClassId(classId).pipe(
      map(response => {
        this.loadingCourses.delete(classId);
        
        if (response.success && response.courses) {
          // Lưu vào cache
          this.coursesCache.set(classId, response.courses);
          return response.courses;
        }
        
        // Lưu mảng rỗng vào cache
        this.coursesCache.set(classId, []);
        return [];
      }),
      catchError(error => {
        this.loadingCourses.delete(classId);
        console.error('Error loading courses for classId:', classId, error);
        // Lưu mảng rỗng vào cache khi có lỗi
        this.coursesCache.set(classId, []);
        return of([]);
      }),
      shareReplay(1) // Share kết quả cho multiple subscribers
    );
  }

  /**
   * Clear cache cho một classId cụ thể hoặc toàn bộ cache
   */
  clearCache(classId?: number): void {
    if (classId) {
      this.coursesCache.delete(classId);
      this.loadingCourses.delete(classId);
    } else {
      this.coursesCache.clear();
      this.loadingCourses.clear();
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

