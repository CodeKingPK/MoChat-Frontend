import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RTCView } from 'react-native-webrtc';
import webrtcService from '../../services/webrtcService';
import WebSocketService from '../../services/WebSocketService';
import { callAPI } from '../../services/apiService';
import { WS_EVENTS } from '../../config/constants';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const CallingScreen = ({ route, navigation }) => {
  const { user: otherUser, callType = 'audio', isOutgoing = true, callId: incomingCallId, offer: incomingOffer } = route.params;
  const { user } = useAuth();
  
  const [callStatus, setCallStatus] = useState(isOutgoing ? 'calling' : 'incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(callType === 'video');
  const [isCameraOn, setIsCameraOn] = useState(callType === 'video');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const callIdRef = useRef(incomingCallId || null);
  const callStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    initializeCall();

    // Listen for WebSocket events
    WebSocketService.on(WS_EVENTS.CALL_ANSWER, handleCallAnswer);
    WebSocketService.on(WS_EVENTS.CALL_ICE_CANDIDATE, handleIceCandidate);
    WebSocketService.on(WS_EVENTS.CALL_REJECTED, handleCallRejected);
    WebSocketService.on(WS_EVENTS.CALL_ENDED, handleCallEnded);
    WebSocketService.on(WS_EVENTS.CALL_ACCEPTED, handleCallAccepted);

    // Handle app state
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      cleanup();
      WebSocketService.off(WS_EVENTS.CALL_ANSWER, handleCallAnswer);
      WebSocketService.off(WS_EVENTS.CALL_ICE_CANDIDATE, handleIceCandidate);
      WebSocketService.off(WS_EVENTS.CALL_REJECTED, handleCallRejected);
      WebSocketService.off(WS_EVENTS.CALL_ENDED, handleCallEnded);
      WebSocketService.off(WS_EVENTS.CALL_ACCEPTED, handleCallAccepted);
      subscription?.remove();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get local media stream
      const stream = await webrtcService.getLocalStream(callType === 'video');
      setLocalStream(stream);

      // Setup WebRTC callbacks
      webrtcService.onLocalStream = (s) => setLocalStream(s);
      webrtcService.onRemoteStream = (s) => {
        setRemoteStream(s);
        if (callStatus !== 'connected') {
          setCallStatus('connected');
          startCallTimer();
        }
      };
      webrtcService.onIceCandidate = (candidate) => {
        WebSocketService.sendIceCandidate(otherUser._id, candidate, callIdRef.current);
      };
      webrtcService.onConnectionStateChange = (state) => {
        if (state === 'connected' && callStatus !== 'connected') {
          setCallStatus('connected');
          startCallTimer();
        } else if (state === 'disconnected' || state === 'failed') {
          handleCallEnded();
        }
      };

      if (isOutgoing) {
        // Create call record
        const response = await callAPI.createCallRecord(otherUser._id, callType);
        callIdRef.current = response.call._id;

        // Create and send offer
        const offer = await webrtcService.createOffer();
        WebSocketService.sendCallOffer(otherUser._id, offer, callType, callIdRef.current);
      } else {
        // Incoming call - store offer for when user answers
        callIdRef.current = incomingCallId;
      }
    } catch (error) {
      console.error('Error initializing call:', error);
      Alert.alert('Call Error', 'Failed to initialize call. Please check permissions.');
      navigation.goBack();
    }
  };

  const handleCallAnswer = async ({ answer }) => {
    try {
      await webrtcService.handleAnswer(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async ({ candidate }) => {
    try {
      await webrtcService.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const handleCallRejected = () => {
    Alert.alert('Call Declined', `${otherUser.name} declined the call`);
    endCall('declined');
  };

  const handleCallEnded = () => {
    endCall('ended');
  };

  const handleCallAccepted = () => {
    setCallStatus('connecting');
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background' && callType === 'video') {
      webrtcService.toggleCamera(false);
      setIsCameraOn(false);
    }
  };

  const startCallTimer = () => {
    callStartTimeRef.current = Date.now();
    durationIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      setCallDuration(elapsed);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async () => {
    try {
      setCallStatus('connecting');
      
      // Create answer
      const answer = await webrtcService.createAnswer(incomingOffer);
      
      // Send answer back
      WebSocketService.sendCallAnswer(otherUser._id, answer, callIdRef.current);
      WebSocketService.acceptCall(otherUser._id, callIdRef.current);
    } catch (error) {
      console.error('Error answering call:', error);
      Alert.alert('Error', 'Failed to answer call');
    }
  };

  const handleDecline = () => {
    WebSocketService.rejectCall(otherUser._id, callIdRef.current);
    endCall('declined');
  };

  const endCall = async (reason = 'ended') => {
    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (callIdRef.current && callStartTimeRef.current) {
        const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
        await callAPI.updateCallRecord(callIdRef.current, 'completed', duration);
      } else if (callIdRef.current) {
        await callAPI.updateCallRecord(callIdRef.current, reason === 'declined' ? 'declined' : 'missed', 0);
      }

      WebSocketService.endCall(otherUser._id, callIdRef.current);
      webrtcService.endCall();
      navigation.goBack();
    } catch (error) {
      console.error('Error ending call:', error);
      cleanup();
      navigation.goBack();
    }
  };

  const cleanup = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    webrtcService.endCall();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    webrtcService.toggleMic(newMutedState);
  };

  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
  };

  const toggleCamera = () => {
    const newCameraState = !isCameraOn;
    setIsCameraOn(newCameraState);
    webrtcService.toggleCamera(newCameraState);
  };

  const switchCamera = async () => {
    try {
      await webrtcService.switchCamera();
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  const renderIncomingCall = () => (
    <View style={styles.incomingContainer}>
      <Text style={styles.statusText}>Incoming {callType} call</Text>
      <Image
        source={{ uri: otherUser?.avatar || 'https://via.placeholder.com/150' }}
        style={styles.largeAvatar}
      />
      <Text style={styles.callerName}>{otherUser?.name || 'Unknown'}</Text>
      <Text style={styles.callTypeText}>{callType} call</Text>

      <View style={styles.incomingActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={handleDecline}
        >
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAnswer}
        >
          <Ionicons name="call" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOutgoingCall = () => (
    <View style={styles.outgoingContainer}>
      {callType === 'video' && localStream ? (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideoLarge}
          objectFit="cover"
          mirror={true}
        />
      ) : (
        <Image
          source={{ uri: otherUser?.avatar || 'https://via.placeholder.com/150' }}
          style={styles.largeAvatar}
        />
      )}
      <View style={styles.outgoingOverlay}>
        <Text style={styles.callerName}>{otherUser?.name || 'Unknown'}</Text>
        <Text style={styles.statusText}>Calling...</Text>
      </View>

      <TouchableOpacity style={styles.endCallButton} onPress={() => endCall('cancelled')}>
        <Ionicons name="call" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderConnectedCall = () => (
    <View style={styles.connectedContainer}>
      {callType === 'video' ? (
        <>
          {remoteStream && (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={styles.remoteVideo}
              objectFit="cover"
            />
          )}
          
          {localStream && isCameraOn && (
            <View style={styles.localVideoContainer}>
              <RTCView
                streamURL={localStream.toURL()}
                style={styles.localVideo}
                objectFit="cover"
                mirror={true}
              />
            </View>
          )}

          <View style={styles.videoCallInfo}>
            <Text style={styles.callerName}>{otherUser?.name}</Text>
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          <Image
            source={{ uri: otherUser?.avatar || 'https://via.placeholder.com/150' }}
            style={styles.largeAvatar}
          />
          <Text style={styles.callerName}>{otherUser?.name || 'Unknown'}</Text>
          <Text style={styles.connectedText}>Connected</Text>
        </>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={toggleMute}
        >
          <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={28} color="#fff" />
        </TouchableOpacity>

        {callType === 'audio' && (
          <TouchableOpacity
            style={[styles.controlButton, isSpeaker && styles.activeControl]}
            onPress={toggleSpeaker}
          >
            <Ionicons name={isSpeaker ? 'volume-high' : 'volume-medium'} size={28} color="#fff" />
          </TouchableOpacity>
        )}

        {callType === 'video' && (
          <>
            <TouchableOpacity
              style={[styles.controlButton, !isCameraOn && styles.activeControl]}
              onPress={toggleCamera}
            >
              <Ionicons name={isCameraOn ? 'videocam' : 'videocam-off'} size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
              <Ionicons name="camera-reverse" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.endCallButton} onPress={() => endCall()}>
        <Ionicons name="call" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      {callStatus === 'incoming' && renderIncomingCall()}
      {(callStatus === 'calling' || callStatus === 'connecting') && renderOutgoingCall()}
      {callStatus === 'connected' && renderConnectedCall()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  incomingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  outgoingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outgoingOverlay: {
    position: 'absolute',
    top: 100,
    alignItems: 'center',
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  largeAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 30,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  callerName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  callTypeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  connectedText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  durationText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginTop: 20,
  },
  incomingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.7,
    marginTop: 80,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acceptButton: {
    backgroundColor: '#25D366',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 40,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 60,
    height: 60,
  },
  activeControl: {
    backgroundColor: '#FF3B30',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  remoteVideo: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  localVideoLarge: {
    width: width,
    height: height,
  },
  videoCallInfo: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
});

export default CallingScreen;
