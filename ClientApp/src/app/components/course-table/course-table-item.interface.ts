export interface CourseTableItem {
  Id: number;
  Name: string;
  Duration: number; // Số tiết
  Tuition: number;
  ClassId: number;
  ClassroomName: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

