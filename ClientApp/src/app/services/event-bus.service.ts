import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CourseTableItem } from '../components/course-table/course-table-item.interface';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  // Subject để emit event register click
  private registerClickSource = new Subject<CourseTableItem>();

  // Observable để các component khác subscribe
  registerClick$: Observable<CourseTableItem> = this.registerClickSource.asObservable();

  /**
   * Emit event khi user click register trong CourseTableComponent
   */
  emitRegisterClick(item: CourseTableItem): void {
    this.registerClickSource.next(item);
  }
}
