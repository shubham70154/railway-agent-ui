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
  isLoading: boolean = false;
  isLoadingModels: boolean = false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.isLoadingModels = true;
    this.chatService.getModels().subscribe({
      next: (models) => {
        this.models = models;
        if (models.length && !models.includes(this.selectedModel)) {
          this.selectedModel = models[0];
        }
        this.isLoadingModels = false;
      },
      error: (err) => {
        console.error('Failed to load models', err);
        this.isLoadingModels = false;
      }
    });
  }

  sendMessage() {
    if (!this.message.trim() || this.isLoading) {
      return;
    }

    const sentMessage = this.message;

    this.messages.push({
      sender: 'User',
      text: sentMessage
    });

    this.isLoading = true;
    this.message = '';

    this.chatService
      .chat(sentMessage, this.selectedModel)
      .subscribe({
        next: (res: any) => {
          this.messages.push({
            sender: 'AI',
            text: res.response
          });
          this.isLoading = false;
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
          this.isLoading = false;
          this.message = sentMessage;
        }
      });
  }

  clearChat() {
    this.messages = [];
  }
}
