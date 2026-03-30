import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await firstValueFrom(
      this.http.post<{ url: string }>(
        `${environment.apiUrl}/upload/image`,
        formData,
      ),
    );
    return res.url;
  }
}
