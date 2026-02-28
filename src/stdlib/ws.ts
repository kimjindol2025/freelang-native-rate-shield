/**
 * FreeLang Standard Library: std/ws
 *
 * WebSocket client utilities
 */

/**
 * WebSocket connection state
 */
export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}

/**
 * WebSocket client
 */
export class WebSocketClient {
  url: string;
  state: WebSocketState = WebSocketState.CLOSED;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private wsInstance: any;

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   * @returns Promise that resolves when connected
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Note: In Node.js, we'd need to use a library like 'ws'
        // For now, this is a placeholder implementation
        this.state = WebSocketState.CONNECTING;

        // Simulate connection
        setTimeout(() => {
          this.state = WebSocketState.OPEN;
          this.emit('open');
          resolve();
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Send message to server
   * @param data Message data
   */
  send(data: string | object): void {
    if (this.state !== WebSocketState.OPEN) {
      throw new Error('WebSocket is not open');
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    if (this.wsInstance) {
      this.wsInstance.send(message);
    }
  }

  /**
   * Close connection
   * @returns Promise that resolves when closed
   */
  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.state === WebSocketState.CLOSED) {
        resolve();
        return;
      }

      this.state = WebSocketState.CLOSING;
      setTimeout(() => {
        this.state = WebSocketState.CLOSED;
        this.emit('close');
        resolve();
      }, 100);
    });
  }

  /**
   * Register event listener
   * @param event Event name (open, message, error, close)
   * @param callback Callback function
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   * @param event Event name
   * @param callback Callback function
   */
  off(event: string, callback: (...args: any[]) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Emit event
   * @param event Event name
   * @param args Arguments
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const callback of listeners) {
        callback(...args);
      }
    }
  }

  /**
   * Check if connection is open
   * @returns true if open
   */
  isOpen(): boolean {
    return this.state === WebSocketState.OPEN;
  }

  /**
   * Check if connection is closed
   * @returns true if closed
   */
  isClosed(): boolean {
    return this.state === WebSocketState.CLOSED;
  }
}

/**
 * Create WebSocket client
 * @param url WebSocket URL
 * @returns WebSocketClient instance
 */
export function create(url: string): WebSocketClient {
  return new WebSocketClient(url);
}
