
import { BridgeStatus } from "../types";

class BridgeClient {
  private socket: WebSocket | null = null;
  private statusListeners: ((status: BridgeStatus) => void)[] = [];
  private currentStatus: BridgeStatus = BridgeStatus.Disconnected;

  constructor() {
    this.connect();
  }

  public connect(url: string = 'ws://localhost:8866') {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.updateStatus(BridgeStatus.Connecting);
    
    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('UE5 Bridge Connected');
        this.updateStatus(BridgeStatus.Connected);
      };

      this.socket.onclose = () => {
        console.log('UE5 Bridge Disconnected');
        this.updateStatus(BridgeStatus.Disconnected);
      };

      this.socket.onerror = (err) => {
        console.error('UE5 Bridge WebSocket Error', err);
        this.updateStatus(BridgeStatus.Error);
      };

      this.socket.onmessage = (msg) => {
          console.log('Message from UE5 Bridge:', msg.data);
      };
    } catch (e) {
      console.error('Bridge Connection Error:', e);
      this.updateStatus(BridgeStatus.Error);
    }
  }

  public onStatusChange(callback: (status: BridgeStatus) => void) {
    this.statusListeners.push(callback);
    callback(this.currentStatus);
  }

  private updateStatus(status: BridgeStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(cb => cb(status));
  }

  public async pushScript(script: string): Promise<boolean> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    const payload = JSON.stringify({
      type: 'execute_python',
      payload: script
    });

    this.socket.send(payload);
    return true;
  }

  public disconnect() {
    this.socket?.close();
  }
}

export const bridgeClient = new BridgeClient();
