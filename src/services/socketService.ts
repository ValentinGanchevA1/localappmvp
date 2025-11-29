import { io, Socket } from 'socket.io-client';
import { store } from '@/store';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(url: string): void {
    if (this.socket?.connected) {
      console.warn('[SocketService] Already connected');
      return;
    }

    this.socket = io(url, {
      autoConnect: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[SocketService] Connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('[SocketService] Error:', error);
    });

    this.socket.on('reconnect_attempt', () => {
      this.reconnectAttempts++;
      console.log(
        `[SocketService] Reconnect attempt ${this.reconnectAttempts}`
      );
    });
  }

  public emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Socket not connected');
      return;
    }
    this.socket.emit(event, data);
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn('[SocketService] Socket not initialized');
      return;
    }
    this.socket.on(event, callback);
  }

  public off(event: string): void {
    if (!this.socket) return;
    this.socket.off(event);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
