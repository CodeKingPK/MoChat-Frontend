import React, { useEffect } from 'react';
import { AppRegistry, DeviceEventEmitter } from 'react-native';
import WebSocketService from '../services/WebSocketService';
import { WS_EVENTS } from '../config/constants';

let navigationRef = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

export const setupIncomingCallHandler = () => {
  WebSocketService.on(WS_EVENTS.CALL_INCOMING, handleIncomingCall);
};

export const removeIncomingCallHandler = () => {
  WebSocketService.off(WS_EVENTS.CALL_INCOMING, handleIncomingCall);
};

const handleIncomingCall = ({ caller, callType, callId, offer }) => {
  console.log('Incoming call from:', caller.name);
  
  // Emit event for IncomingCallModal
  DeviceEventEmitter.emit('INCOMING_CALL', {
    user: caller,
    callType,
    callId,
    offer,
  });
  
  // Optionally navigate to calling screen immediately
  // if (navigationRef) {
  //   navigationRef.navigate('Calling', {
  //     user: caller,
  //     callType,
  //     isOutgoing: false,
  //     callId,
  //     offer,
  //   });
  // }
};

export default {
  setNavigationRef,
  setupIncomingCallHandler,
  removeIncomingCallHandler,
};
