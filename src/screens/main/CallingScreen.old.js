import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';

const { width } = Dimensions.get('window');

const CallingScreen = ({ route, navigation }) => {
  const { user, callType = 'audio', isOutgoing = true } = route.params;
  const [callStatus, setCallStatus] = useState(isOutgoing ? 'calling' : 'incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    // Auto answer after 2 seconds for demo (replace with real WebRTC later)
    if (isOutgoing) {
      setTimeout(() => {
        setCallStatus('connected');
      }, 2000);
    }

    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    let interval;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    // TODO: Send end call signal via WebSocket
    navigation.goBack();
  };

  const handleAnswer = () => {
    setCallStatus('connected');
    // TODO: Accept call via WebRTC
  };

  const handleDecline = () => {
    // TODO: Send decline signal via WebSocket
    navigation.goBack();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Mute/unmute microphone
  };

  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker);
    // TODO: Toggle speaker/earpiece
  };

  const renderIncomingCall = () => (
    <View style={styles.incomingContainer}>
      <Text style={styles.statusText}>Incoming {callType} call</Text>
      <Image
        source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
        style={styles.largeAvatar}
      />
      <Text style={styles.callerName}>{user?.name || 'Unknown'}</Text>
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

  const renderConnectedCall = () => (
    <View style={styles.connectedContainer}>
      <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
      
      <Image
        source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
        style={styles.largeAvatar}
      />
      <Text style={styles.callerName}>{user?.name || 'Unknown'}</Text>
      <Text style={styles.connectedText}>Connected</Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.activeControl]}
          onPress={toggleMute}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={28}
            color={isMuted ? '#fff' : '#666'}
          />
          <Text style={[styles.controlLabel, isMuted && styles.activeLabel]}>
            {isMuted ? 'Muted' : 'Mute'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isSpeaker && styles.activeControl]}
          onPress={toggleSpeaker}
        >
          <Ionicons
            name={isSpeaker ? 'volume-high' : 'volume-medium'}
            size={28}
            color={isSpeaker ? '#fff' : '#666'}
          />
          <Text style={[styles.controlLabel, isSpeaker && styles.activeLabel]}>
            Speaker
          </Text>
        </TouchableOpacity>

        {callType === 'video' && (
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={28} color="#666" />
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <Ionicons name="call" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderOutgoingCall = () => (
    <View style={styles.outgoingContainer}>
      <Image
        source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
        style={styles.largeAvatar}
      />
      <Text style={styles.callerName}>{user?.name || 'Unknown'}</Text>
      <Text style={styles.statusText}>Calling...</Text>

      <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
        <Ionicons name="call" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      {callStatus === 'incoming' && renderIncomingCall()}
      {callStatus === 'calling' && renderOutgoingCall()}
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
    paddingVertical: 50,
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
    justifyContent: 'space-around',
    width: width * 0.8,
    marginVertical: 40,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 80,
  },
  activeControl: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
  activeLabel: {
    fontWeight: '600',
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
});

export default CallingScreen;
