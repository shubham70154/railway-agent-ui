import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = environment.apiUrl; // 'http://localhost:8000'

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
