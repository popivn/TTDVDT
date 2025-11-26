import { Injectable } from '@angular/core';

export interface EnrollmentEmailData {
  fullName: string;
  email: string;
  phoneNumber: string;
  classroomName: string;
  courseName: string;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  
  /**
   * Escape HTML để tránh XSS attacks
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Tạo email template xác nhận đăng ký khóa học
   */
  createEnrollmentConfirmationEmail(data: EnrollmentEmailData): string {
    const fullName = this.escapeHtml(data.fullName);
    const email = this.escapeHtml(data.email);
    const phoneNumber = this.escapeHtml(data.phoneNumber);
    const classroomName = this.escapeHtml(data.classroomName);
    const courseName = this.escapeHtml(data.courseName);
    const note = data.note ? this.escapeHtml(data.note) : '';
    
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
<h1 style="color: white; margin: 0; font-size: 24px;">Xác Nhận Đăng Ký Khóa Học</h1>
</div>
<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
<p style="font-size: 16px; margin-bottom: 20px;">Xin chào <strong>${fullName}</strong>,</p>
<p style="font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn đã đăng ký khóa học tại hệ thống của chúng tôi. Chúng tôi đã nhận được thông tin đăng ký của bạn:</p>
<div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
<table style="width: 100%; border-collapse: collapse;">
<tr>
<td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Họ và tên:</td>
<td style="padding: 8px 0; color: #333;">${fullName}</td>
</tr>
<tr>
<td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
<td style="padding: 8px 0; color: #333;">${email}</td>
</tr>
<tr>
<td style="padding: 8px 0; font-weight: bold; color: #555;">Số điện thoại:</td>
<td style="padding: 8px 0; color: #333;">${phoneNumber}</td>
</tr>
<tr>
<td style="padding: 8px 0; font-weight: bold; color: #555;">Lớp học:</td>
<td style="padding: 8px 0; color: #333;">${classroomName}</td>
</tr>
<tr>
<td style="padding: 8px 0; font-weight: bold; color: #555;">Khóa học:</td>
<td style="padding: 8px 0; color: #333;">${courseName}</td>
</tr>${note ? `
<tr>
<td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Ghi chú:</td>
<td style="padding: 8px 0; color: #333;">${note}</td>
</tr>` : ''}
</table>
</div>
<p style="font-size: 16px; margin: 20px 0;">Chúng tôi sẽ xem xét đăng ký của bạn và liên hệ lại với bạn trong thời gian sớm nhất qua email hoặc số điện thoại bạn đã cung cấp.</p>
<p style="font-size: 16px; margin-top: 30px;">Trân trọng,<br><strong>Ban Quản Lý Hệ Thống</strong></p>
</div>
<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
<p style="margin: 5px 0;">Email này được gửi tự động, vui lòng không trả lời email này.</p>
</div>
</div>`;
  }

  /**
   * Tạo email template cơ bản với header và footer
   */
  createBaseEmailTemplate(options: {
    title: string;
    greeting?: string;
    content: string;
    footerText?: string;
  }): string {
    const greeting = options.greeting || 'Xin chào,';
    const footerText = options.footerText || 'Email này được gửi tự động, vui lòng không trả lời email này.';
    const title = this.escapeHtml(options.title);
    const content = options.content;
    
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
<h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
</div>
<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
<p style="font-size: 16px; margin-bottom: 20px;">${greeting}</p>
${content}
<p style="font-size: 16px; margin-top: 30px;">Trân trọng,<br><strong>Ban Quản Lý Hệ Thống</strong></p>
</div>
<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
<p style="margin: 5px 0;">${footerText}</p>
</div>
</div>`;
  }

  /**
   * Tạo table thông tin trong email
   */
  createInfoTable(data: { [key: string]: string }): string {
    let rows = '';
    for (const [label, value] of Object.entries(data)) {
      rows += `
<tr>
<td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">${this.escapeHtml(label)}:</td>
<td style="padding: 8px 0; color: #333;">${this.escapeHtml(value)}</td>
</tr>`;
    }
    
    return `<div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
<table style="width: 100%; border-collapse: collapse;">
${rows}
</table>
</div>`;
  }
}

