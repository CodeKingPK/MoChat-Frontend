import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const IncomingCallModal = () => {
  const [visible, setVisible] = useState(false);
  const [callData, setCallData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('INCOMING_CALL', (data) => {
      setCallData(data);
      setVisible(true);
    });

    return () => subscription.remove();
  }, []);

  const handleAccept = () => {
    setVisible(false);
    navigation.navigate('Calling', {
      user: callData.user,
      callType: callData.callType,
      isOutgoing: false,
      callId: callData.callId,
      offer: callData.offer,
    });
  };

  const handleDecline = () => {
    setVisible(false);
    // Will be handled by CallingScreen if navigated there
    // or send rejection via WebSocket here
  };

  if (!callData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleDecline}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Incoming {callData.callType} call</Text>
          
          <Image
            source={{ uri: callData.user?.avatar || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          
          <Text style={styles.name}>{callData.user?.name || 'Unknown'}</Text>
          <Text style={styles.subtitle}>{callData.callType} call</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={handleDecline}
            >
              <Ionicons name="close" size={32} color="#fff" />
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Ionicons name="call" size={32} color="#fff" />
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#075E54',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#25D366',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
});

export default IncomingCallModal;
