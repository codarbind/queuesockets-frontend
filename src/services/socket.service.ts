// src/services/socketService.ts
import { io, Socket } from 'socket.io-client';
import { QueueData } from '../types';



class SocketService {
  private socket: Socket | null = null;

  private socketUrl: string = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

  // Initialize and connect to the socket
  connect(): void {
  
    this.socket = io(this.socketUrl);

    this.socket.on('connect_error', (error) => {
        console.error('Connection failed:', error);
      });
    
      this.socket.on('reconnect_failed', () => {
        console.error('Reconnection failed after several attempts');
      });
    
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

  }
  
  messageBuffer: QueueData[] = [];//buffer-to-handle-server-downtime
  
  // Send data to the server
  sendData(data: QueueData): void {
    if (this.socket?.connected) {
      this.socket.emit("data", data);
    
      this.messageBuffer.forEach((data) => this.socket?.emit("data", data));
      this.messageBuffer.length = 0; // Clear buffer
     
    } else {
    //  console.log('not-connected')
      this.messageBuffer.push(data);
    }
 
  }

  // Disconnect from the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();
export default socketService;
