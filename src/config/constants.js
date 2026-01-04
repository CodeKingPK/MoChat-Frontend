// App Configuration
// IMPORTANT: Replace 'YOUR_COMPUTER_IP' with your actual IP address
// To find your IP: Check the backend terminal output after starting the server
// Or run: ifconfig (Mac/Linux) or ipconfig (Windows)

// For local testing on same device/emulator
// export const API_BASE_URL = 'http://localhost:3000/api';
// export const WS_BASE_URL = 'ws://localhost:3000';

// For testing on physical device or different emulator (same network)
// Your computer's local IP address (shown in backend terminal)
export const API_BASE_URL = 'http://192.168.1.108:3000/api';
export const WS_BASE_URL = 'ws://192.168.1.108:3000';

// For production deployment
// export const API_BASE_URL = 'https://your-backend.com/api';
// export const WS_BASE_URL = 'wss://your-backend.com';

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
};

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};

export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  TYPING: 'typing',
  ONLINE: 'online',
  OFFLINE: 'offline',
  MESSAGE_DELIVERED: 'message:delivered',
  MESSAGE_READ: 'message:read',
  ERROR: 'error',
  
  // Call signaling events
  CALL_OFFER: 'call:offer',
  CALL_ANSWER: 'call:answer',
  CALL_ICE_CANDIDATE: 'call:ice-candidate',
  CALL_INCOMING: 'call:incoming',
  CALL_REJECTED: 'call:rejected',
  CALL_ENDED: 'call:ended',
  CALL_ACCEPTED: 'call:accepted',
};
