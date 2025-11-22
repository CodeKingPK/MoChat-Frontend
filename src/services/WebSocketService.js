import { WS_BASE_URL, WS_EVENTS } from '../config/constants';

/**
 * Efficient WebSocket Service (WhatsApp-style)
 * - Native WebSocket (lighter than Socket.IO)
 * - Auto-reconnection with exponential backoff
 * - Message queue for offline messages
 * - Event-based architecture
 */
class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000;
    this.messageQueue = [];
    this.listeners = {};
    this.token = null;
    this.heartbeatInterval = null;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token) {
    if (this.ws && this.isConnected) {
      console.log('Already connected');
      return;
    }

    this.token = token;
    const wsUrl = `${WS_BASE_URL}?token=${token}`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit(WS_EVENTS.CONNECT);
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      this.emit(WS_EVENTS.DISCONNECT);
      
      // Auto-reconnect unless it was a clean close
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit(WS_EVENTS.ERROR, error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }

  /**
   * Handle incoming messages
   */
  handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case WS_EVENTS.MESSAGE:
        this.emit(WS_EVENTS.MESSAGE, payload);
        break;
      case WS_EVENTS.TYPING:
        this.emit(WS_EVENTS.TYPING, payload);
        break;
      case WS_EVENTS.MESSAGE_DELIVERED:
        this.emit(WS_EVENTS.MESSAGE_DELIVERED, payload);
        break;
      case WS_EVENTS.MESSAGE_READ:
        this.emit(WS_EVENTS.MESSAGE_READ, payload);
        break;
      case WS_EVENTS.ONLINE:
        this.emit(WS_EVENTS.ONLINE, payload);
        break;
      case WS_EVENTS.OFFLINE:
        this.emit(WS_EVENTS.OFFLINE, payload);
        break;
      // Call signaling events
      case WS_EVENTS.CALL_OFFER:
        this.emit(WS_EVENTS.CALL_OFFER, payload);
        break;
      case WS_EVENTS.CALL_ANSWER:
        this.emit(WS_EVENTS.CALL_ANSWER, payload);
        break;
      case WS_EVENTS.CALL_ICE_CANDIDATE:
        this.emit(WS_EVENTS.CALL_ICE_CANDIDATE, payload);
        break;
      case WS_EVENTS.CALL_INCOMING:
        this.emit(WS_EVENTS.CALL_INCOMING, payload);
        break;
      case WS_EVENTS.CALL_REJECTED:
        this.emit(WS_EVENTS.CALL_REJECTED, payload);
        break;
      case WS_EVENTS.CALL_ENDED:
        this.emit(WS_EVENTS.CALL_ENDED, payload);
        break;
      case WS_EVENTS.CALL_ACCEPTED:
        this.emit(WS_EVENTS.CALL_ACCEPTED, payload);
        break;
      case 'pong':
        // Heartbeat response - ignore
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }

  /**
   * Send message through WebSocket
   */
  send(type, payload) {
    const message = JSON.stringify({ type, payload });

    if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
      console.log('Message queued (offline)');
    }
  }

  /**
   * Send queued messages when reconnected
   */
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.ws.send(message);
    }
  }

  /**
   * Heartbeat to keep connection alive
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000); // Every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Reconnection with exponential backoff
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(this.token);
    }, delay);
  }

  /**
   * Event listeners
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.messageQueue = [];
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId, isTyping) {
    this.send(WS_EVENTS.TYPING, { chatId, isTyping });
  }

  /**
   * Mark message as delivered
   */
  markDelivered(messageId) {
    this.send(WS_EVENTS.MESSAGE_DELIVERED, { messageId });
  }

  /**
   * Mark message as read
   */
  markRead(messageId) {
    this.send(WS_EVENTS.MESSAGE_READ, { messageId });
  }

  /**
   * Send call offer
   */
  sendCallOffer(receiverId, offer, callType, callId) {
    this.send(WS_EVENTS.CALL_OFFER, { receiverId, offer, callType, callId });
  }

  /**
   * Send call answer
   */
  sendCallAnswer(callerId, answer, callId) {
    this.send(WS_EVENTS.CALL_ANSWER, { callerId, answer, callId });
  }

  /**
   * Send ICE candidate
   */
  sendIceCandidate(peerId, candidate, callId) {
    this.send(WS_EVENTS.CALL_ICE_CANDIDATE, { peerId, candidate, callId });
  }

  /**
   * Reject incoming call
   */
  rejectCall(callerId, callId) {
    this.send(WS_EVENTS.CALL_REJECTED, { callerId, callId });
  }

  /**
   * End active call
   */
  endCall(peerId, callId) {
    this.send(WS_EVENTS.CALL_ENDED, { peerId, callId });
  }

  /**
   * Accept incoming call
   */
  acceptCall(callerId, callId) {
    this.send(WS_EVENTS.CALL_ACCEPTED, { callerId, callId });
  }
}

export default new WebSocketService();
