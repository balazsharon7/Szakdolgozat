import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { UserService } from '../user.service';
import { Message } from '../messages.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  conversations: any[] = [];
  selectedConversation: any = null;
  currentUser: any;
  loading: boolean = true;
  newMessageContent: string = '';

  constructor(
    private messagesService: MessagesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.loadConversations();
    } else {
      console.error('Nincs bejelentkezett felhasználó!');
    }
  }

  loadConversations(): void {
    if (!this.currentUser || !this.currentUser.userId) {
      console.error('Hiba: Nincs bejelentkezett felhasználó!');
      return;
    }

    const userId = this.currentUser.userId;
    console.log('Üzenetek lekérése userId-val:', userId);

    const receivedMessages$ = this.messagesService.getMessagesByReceiverId(userId);
    const sentMessages$ = this.messagesService.getMessagesBySenderId(userId);

    forkJoin([receivedMessages$, sentMessages$]).subscribe(
      ([received, sent]) => {
        const allMessages = [...received, ...sent];
        this.groupMessagesBySender(allMessages);
        this.loading = false;
      },
      (error) => {
        console.error('Hiba az üzenetek lekérésekor:', error);
        this.loading = false;
      }
    );
  }

  groupMessagesBySender(messages: Message[]): void {
    const grouped: { [key: number]: any } = {};
  
    messages.forEach((message) => {
      const otherUserId =
        message.senderId === this.currentUser.userId ? message.receiverId : message.senderId;
  
      if (!grouped[otherUserId]) {
        grouped[otherUserId] = {
          senderId: otherUserId,
          senderName: '', 
          lastMessage: message.content,
          messages: [],
        };
  
    
        this.userService.getUsernameById(otherUserId).pipe(
          catchError((error) => {
            console.error(`Hiba a felhasználónév lekérésekor (ID: ${otherUserId}):`, error);
            return of('Ismeretlen felhasználó'); 
          })
        ).subscribe((username) => {
          grouped[otherUserId].senderName = username;
        });
      }
  
      grouped[otherUserId].messages.push(message);
      grouped[otherUserId].lastMessage = message.content;
    });
  
   
    Object.values(grouped).forEach((conversation: any) => {
      conversation.messages.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
  
    this.conversations = Object.values(grouped);
  }
  
  openConversation(conversation: any): void {
    this.selectedConversation = conversation;
  
 
    this.selectedConversation.messages.sort((a: Message, b: Message) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  
 
    setTimeout(() => {
      const container = document.querySelector('.conversation-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
  
  sendMessage(): void {
    if (!this.newMessageContent.trim()) return;
  
    const receiverId = this.selectedConversation.senderId;
    this.messagesService
      .sendMessage(this.currentUser.userId, receiverId, this.newMessageContent)
      .subscribe(
        (newMessage) => {
          this.selectedConversation.messages.push(newMessage);
  
        
          this.selectedConversation.messages.sort((a: Message, b: Message) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
  
        
          setTimeout(() => {
            const container = document.querySelector('.conversation-messages');
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          }, 0);
  
          this.newMessageContent = '';
        },
        (error) => {
          console.error('Hiba történt az üzenet küldésekor:', error);
        }
      );
  }
  


  closeConversation(): void {
    this.selectedConversation = null;
  }

  
}
