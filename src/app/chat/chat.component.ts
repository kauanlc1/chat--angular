import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface IMessage {
  myMessage: boolean;
  body: string;
  createdAt: string;
}

interface ICreateMessage {
  myMessage: boolean;
}

interface IAdvice {
  slip: {
    id: number;
    advice: string;
  };
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  inputMessage: string = '';
  messages: IMessage[] = [];
  apiUrl: string = 'https://api.adviceslip.com/advice';
  messagesContainer: HTMLElement;
  chatIsOpen: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.messages = [];

    if (localStorage.getItem('messages')) {
      this.messages = JSON.parse(localStorage.getItem('messages') ?? '');
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer = document.getElementById('messagesContainer')!;
      this.messagesContainer.scrollTo(0, this.messagesContainer.scrollHeight);
    }, 0);
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  openOrCloseChat() {
    this.chatIsOpen = !this.chatIsOpen;
  }

  getAdvice() {
    return this.http.get<IAdvice>(this.apiUrl);
  }

  createMessage({ myMessage }: ICreateMessage) {
    if (!this.inputMessage) return;

    this.messages.push({
      body: this.inputMessage,
      createdAt: new Date().toLocaleTimeString('pt-br', { timeStyle: 'short' }),
      myMessage: myMessage,
    });

    this.inputMessage = '';

    this.scrollToBottom();

    setTimeout(
      () =>
        this.getAdvice().subscribe((res) => {
          this.messages.push({
            body: res.slip.advice,
            createdAt: new Date().toLocaleTimeString('pt-br', {
              timeStyle: 'short',
            }),
            myMessage: false,
          });

          this.scrollToBottom();
          this.saveMessages();
        }),
      500
    );
  }
}
