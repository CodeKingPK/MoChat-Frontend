import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from './VideoPlayer';

const { width, height } = Dimensions.get('window');

const MediaPreviewModal = ({ visible, mediaAsset, onSend, onClose, isUploading }) => {
  const [caption, setCaption] = useState('');

  const handleSend = () => {
    onSend(caption);
    setCaption('');
  };

  const handleClose = () => {
    setCaption('');
    onClose();
  };

  if (!mediaAsset) return null;

  const isVideo = mediaAsset.type === 'video';

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} disabled={isUploading}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Media Preview */}
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <VideoPlayer
                uri={mediaAsset.uri}
                width={width}
                height={height * 0.7}
                style={styles.media}
              />
            ) : (
              <Image
                source={{ uri: mediaAsset.uri }}
                style={styles.media}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Caption Input & Send Button */}
          <View style={styles.footer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.captionInput}
                placeholder="Add a caption..."
                placeholderTextColor="#999"
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={1000}
                editable={!isUploading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isUploading && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="send" size={22} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    width: width,
    height: height * 0.7,
  },
  footer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  captionInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#888',
  },
});

export default MediaPreviewModal;
