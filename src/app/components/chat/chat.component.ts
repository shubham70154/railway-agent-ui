import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string = '';
  messages: Array<{ sender: string; text: string }> = [];
  models: string[] = [];
  selectedModel: string = 'gemini-2.5-flash';

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getModels().subscribe({
      next: (models) => {
        this.models = models;
        if (models.length && !models.includes(this.selectedModel)) {
          this.selectedModel = models[0];
        }
      },
      error: (err) => console.error('Failed to load models', err)
    });
  }

  sendMessage() {
    if (!this.message.trim()) {
      return;
    }

    this.messages.push({
      sender: 'User',
      text: this.message
    });

    this.chatService
      .chat(this.message, this.selectedModel)
      .subscribe({
        next: (res: any) => {
          this.messages.push({
            sender: 'AI',
            text: res.response
          });
        },
        error: (err) => {
          const apiErr = err?.error;
          const text = apiErr?.error
            ? `${apiErr.error}${apiErr.code ? ' (code ' + apiErr.code + ')' : ''}`
            : `Request failed: ${err?.message || 'Unknown error'}`;
          this.messages.push({
            sender: 'AI',
            text
          });
        }
      });

    this.message = '';
  }

  clearChat() {
    this.messages = [];
  }
}
