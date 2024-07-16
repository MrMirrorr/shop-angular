import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  private readonly uploadUrl = '/api/upload';

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<{ url: string }>(this.uploadUrl, formData);
  }
}
