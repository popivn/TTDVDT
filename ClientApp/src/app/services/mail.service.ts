import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

export interface MailQueueData {
  time: string;
  token: string;
  name: string;
  subject: string;
  body: string;
  cc?: string;
  code: string;
  receivers: string;
}

@Injectable({
  providedIn: 'root',
})
export class MailService {
  // Sử dụng .NET API endpoint để proxy request (tránh CORS)
  // .NET backend sẽ gửi request đến PHP API (server-to-server)
  private mailerApiUrl = '/api/mail/send-queue';
  private testConnectionUrl = '/api/mail/test-connection';

  constructor(private http: HttpClient) {}

  /**
   * Generate the time field in the format expected by the API (timestamp with optional suffix).
   * @param suffix Optional suffix to append (default: empty, use '_test' for testing)
   */
  private generateTime(suffix: string = ''): string {
    return Math.floor(Date.now() / 1000) + suffix;
  }

  /**
   * Generate the token field using MD5 hash matching PHP's md5(date('Ym') . '#!!$@' . time()).
   */
  private generateToken(): string {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const hashInput = `${yearMonth}#!!$@${timestamp}`;
    
    // Use crypto-js to generate MD5 hash matching PHP's md5() function
    return CryptoJS.MD5(hashInput).toString();
  }

  /**
   * Build mail queue data with automatic generation of time and token fields.
   * @param data Partial mail data (time and token will be auto-generated if not provided)
   * @param isTest Whether this is a test email (adds '_test' suffix to time)
   */
  buildMailQueueData(data: Partial<MailQueueData>, isTest: boolean = false): MailQueueData {
    return {
      time: data.time || this.generateTime(isTest ? '_test' : ''),
      token: data.token || this.generateToken(),
      name: data.name || '',
      subject: data.subject || '',
      body: data.body || '',
      cc: data.cc || '',
      code: data.code || '',
      receivers: data.receivers || '',
    };
  }

  /**
   * Send a mail request thông qua .NET API proxy (tránh CORS)
   * .NET backend sẽ proxy request đến PHP mail API (server-to-server)
   * 
   * @param mailData The fields expected by the API.
   */
  sendMailQueue(mailData: MailQueueData): Observable<any> {
    // Gửi request đến .NET API endpoint (JSON format)
    // .NET backend sẽ convert và gửi đến PHP API
    return this.http.post<{
      success: boolean;
      message: string;
      response?: string;
      httpCode?: number;
      error?: string;
    }>(this.mailerApiUrl, mailData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  /**
   * Test connection to queue API thông qua .NET backend (tương tự testQueueConnection trong Laravel)
   */
  testQueueConnection(): Observable<any> {
    // Gọi endpoint test của .NET backend
    return this.http.get<{
      success: boolean;
      message: string;
      response?: string;
      httpCode?: number;
      error?: string;
    }>(this.testConnectionUrl);
  }

  /**
   * Helper method để gửi email đơn giản (wrapper method)
   */
  sendSimpleEmail(options: {
    receivers: string;
    subject: string;
    body: string;
    name?: string;
    cc?: string;
    code?: string;
    isTest?: boolean;
  }): Observable<any> {
    const mailData = this.buildMailQueueData({
      name: options.name || options.subject,
      subject: options.subject,
      body: options.body,
      cc: options.cc || '',
      code: options.code || 'xmhp',
      receivers: options.receivers
    }, options.isTest || false);

    return this.sendMailQueue(mailData);
  }
}
