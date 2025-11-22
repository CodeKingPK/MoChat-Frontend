import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '../services/WebSocketService';
import { WS_EVENTS } from '../config/constants';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext({});

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      initializeWebSocket();
    } else {
      WebSocketService.disconnect();
      setIsConnected(false);
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [isAuthenticated]);

  const initializeWebSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        WebSocketService.connect(token);

        // Listen to connection events
        WebSocketService.on(WS_EVENTS.CONNECT, () => {
          setIsConnected(true);
        });

        WebSocketService.on(WS_EVENTS.DISCONNECT, () => {
          setIsConnected(false);
        });

        WebSocketService.on(WS_EVENTS.ONLINE, (data) => {
          setOnlineUsers(prev => [...prev, data.userId]);
        });

        WebSocketService.on(WS_EVENTS.OFFLINE, (data) => {
          setOnlineUsers(prev => prev.filter(id => id !== data.userId));
        });
      }
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  };

  const sendMessage = (chatId, message) => {
    WebSocketService.send(WS_EVENTS.MESSAGE, {
      chatId,
      ...message,
    });
  };

  const sendTyping = (chatId, isTyping) => {
    WebSocketService.sendTyping(chatId, isTyping);
  };

  const markAsDelivered = (messageId) => {
    WebSocketService.markDelivered(messageId);
  };

  const markAsRead = (messageId) => {
    WebSocketService.markRead(messageId);
  };

  const sendCallOffer = (receiverId, offer, callType, callId) => {
    WebSocketService.sendCallOffer(receiverId, offer, callType, callId);
  };

  const sendCallAnswer = (callerId, answer, callId) => {
    WebSocketService.sendCallAnswer(callerId, answer, callId);
  };

  const sendIceCandidate = (peerId, candidate, callId) => {
    WebSocketService.sendIceCandidate(peerId, candidate, callId);
  };

  const rejectCall = (callerId, callId) => {
    WebSocketService.rejectCall(callerId, callId);
  };

  const endCall = (peerId, callId) => {
    WebSocketService.endCall(peerId, callId);
  };

  const acceptCall = (callerId, callId) => {
    WebSocketService.acceptCall(callerId, callId);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        onlineUsers,
        sendMessage,
        sendTyping,
        markAsDelivered,
        markAsRead,
        sendCallOffer,
        sendCallAnswer,
        sendIceCandidate,
        rejectCall,
        endCall,
        acceptCall,
        wsService: WebSocketService,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
