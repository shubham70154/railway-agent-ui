import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  chat(prompt: string, model: string) {
    return this.http.post<any>(
      `${this.baseUrl}/chat`,
      { prompt: prompt.trim(), model }
    );
  }

  getModels() {
    return this.http.get<string[]>(`${this.baseUrl}/models`);
  }
}
