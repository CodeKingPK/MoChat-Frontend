import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatAPI } from '../../services/apiService';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { WS_EVENTS, MESSAGE_STATUS, API_BASE_URL } from '../../config/constants';
import VideoPlayer from '../../components/VideoPlayer';
import MediaPreviewModal from '../../components/MediaPreviewModal';
import AttachmentBottomSheet from '../../components/AttachmentBottomSheet';
import SimpleEmojiPicker from '../../components/SimpleEmojiPicker';

const ChatRoomScreen = ({ route, navigation }) => {
  const { chat } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const { wsService, sendMessage, sendTyping } = useWebSocket();
  const { user } = useAuth();
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('UserProfile', { 
            user: chat.participant,
            chatId: chat._id 
          })}
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
        >
          <Image
            source={{ 
              uri: chat.participant?.avatar || 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' 
            }}
            style={{ width: 35, height: 35, borderRadius: 17.5, marginRight: 10 }}
          />
          <View>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              {chat.participant?.name || 'Chat'}
            </Text>
            <Text style={{ color: '#d9d9d9', fontSize: 12 }}>
              {otherUserTyping ? 'typing...' : isUserOnline ? 'online' : 'Tap here for contact info'}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      tabBarStyle: { display: 'none' },
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Calling', {
              user: chat.participant,
              callType: 'video',
              isOutgoing: true,
            })}
            style={{ marginRight: 20 }}
          >
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Calling', {
              user: chat.participant,
              callType: 'audio',
              isOutgoing: true,
            })}
          >
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });

    fetchMessages();

    // Keyboard listeners
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setShowEmojiPicker(false);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.chatId === chat._id || message.chat === chat._id) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(m => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
        scrollToBottom();
      }
    };

    const handleTyping = (data) => {
      if (data.chatId === chat._id && data.userId !== user._id) {
        setOtherUserTyping(data.isTyping);
        setIsTyping(data.isTyping);
      }
    };

    const handleOnlineStatus = (data) => {
      if (data.userId === chat.participant?._id) {
        setIsUserOnline(true);
      }
    };

    const handleOfflineStatus = (data) => {
      if (data.userId === chat.participant?._id) {
        setIsUserOnline(false);
      }
    };

    wsService.on(WS_EVENTS.MESSAGE, handleNewMessage);
    wsService.on(WS_EVENTS.TYPING, handleTyping);
    wsService.on(WS_EVENTS.ONLINE, handleOnlineStatus);
    wsService.on(WS_EVENTS.OFFLINE, handleOfflineStatus);

    return () => {
      wsService.off(WS_EVENTS.MESSAGE, handleNewMessage);
      wsService.off(WS_EVENTS.TYPING, handleTyping);
      wsService.off(WS_EVENTS.ONLINE, handleOnlineStatus);
      wsService.off(WS_EVENTS.OFFLINE, handleOfflineStatus);
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [chat._id]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages(chat._id);
      setMessages(response.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleAttachment = async () => {
    setShowAttachmentSheet(true);
  };

  const handleAttachmentOption = async (optionId) => {
    switch (optionId) {
      case 'camera':
        pickImage(true);
        break;
      case 'gallery':
        pickImage(false);
        break;
      case 'document':
        // Document picker functionality
        sendMessage(chat._id, {
          text: '📄 Document sharing feature will be implemented soon',
          type: 'text',
        });
        break;
      case 'audio':
        // Audio recording functionality  
        sendMessage(chat._id, {
          text: '🎤 Voice message feature will be implemented soon',
          type: 'text',
        });
        break;
      case 'location':
        // Location sharing functionality
        sendMessage(chat._id, {
          text: '📍 Location sharing feature will be implemented soon',
          type: 'text',
        });
        break;
      case 'contact':
        // Contact sharing functionality
        sendMessage(chat._id, {
          text: '👤 Contact sharing feature will be implemented soon',
          type: 'text',
        });
        break;
      default:
        break;
    }
  };

  const pickImage = async (useCamera) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to continue');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.7,
          });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaPreview(asset);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSendMedia = async (caption) => {
    if (!mediaPreview) return;
    
    try {
      setUploadingMedia(true);
      await uploadAndSendMedia(mediaPreview, caption);
      setMediaPreview(null);
    } catch (error) {
      console.error('Error sending media:', error);
      Alert.alert('Error', 'Failed to send media');
    } finally {
      setUploadingMedia(false);
    }
  };

  const uploadAndSendMedia = async (asset, caption = '') => {
    try {
      // Create form data
      const formData = new FormData();
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('media', {
        uri: asset.uri,
        type: asset.type === 'video' ? `video/${fileType}` : `image/${fileType}`,
        name: `upload.${fileType}`,
      });

      // Upload to server
      const isVideo = asset.type === 'video';
      const endpoint = isVideo ? '/media/upload/video' : '/media/upload/image';
      
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Send media message via WebSocket with caption
        sendMessage(chat._id, {
          text: caption || '',
          type: isVideo ? 'video' : 'image',
          mediaUrl: data.url,
        });
      } else {
        Alert.alert('Upload Failed', data.message || 'Failed to upload media');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload media');
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');

    // Send via WebSocket (don't add to state, let WebSocket response handle it)
    sendMessage(chat._id, {
      text: messageText,
      type: 'text',
    });

    // Stop typing indicator
    sendTyping(chat._id, false);
  };

  const handleInputChange = (text) => {
    setInputText(text);

    // Send typing indicator
    if (text.length > 0) {
      sendTyping(chat._id, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(chat._id, false);
      }, 2000);
    } else {
      sendTyping(chat._id, false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleEmojiSelect = (emoji) => {
    setInputText(inputText + emoji);
    setShowEmojiPicker(false);
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender === user._id || item.sender?._id === user._id;
    const hasMedia = item.mediaUrl && (item.type === 'image' || item.type === 'video');

    return (
      <View
        style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
          hasMedia && styles.mediaBubble,
        ]}
      >
        {hasMedia && (
          <View style={styles.mediaContainer}>
            {item.type === 'image' ? (
              <TouchableOpacity onPress={() => setViewingImage(item.mediaUrl)}>
                <Image
                  source={{ uri: item.mediaUrl }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : item.type === 'video' ? (
              <VideoPlayer
                uri={item.mediaUrl}
                width={250}
                height={250}
              />
            ) : null}
          </View>
        )}
        {hasMedia && item.text && item.text !== '🖼️ Photo' && item.text !== '📹 Video' && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{item.text}</Text>
          </View>
        )}
        {item.text && !hasMedia && <Text style={styles.messageText}>{item.text}</Text>}
        <View style={[styles.messageFooter, hasMedia && styles.mediaFooter]}>
          <Text style={[styles.messageTime, hasMedia && styles.mediaTime]}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isOwnMessage && (
            <Ionicons
              name={
                item.status === MESSAGE_STATUS.READ
                  ? 'checkmark-done'
                  : item.status === MESSAGE_STATUS.DELIVERED
                  ? 'checkmark-done'
                  : 'checkmark'
              }
              size={16}
              color={
                hasMedia 
                  ? '#fff' 
                  : item.status === MESSAGE_STATUS.READ ? '#34B7F1' : '#999'
              }
              style={styles.checkmark}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingBubble}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
            <Text style={styles.typingText}>{chat.participant?.name} is typing...</Text>
          </View>
        )}

        {uploadingMedia && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator color="#075E54" />
            <Text style={styles.uploadingText}>Uploading media...</Text>
          </View>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <SimpleEmojiPicker onEmojiSelected={handleEmojiSelect} />
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.emojiButton}
            onPress={() => {
              Keyboard.dismiss();
              setShowEmojiPicker(!showEmojiPicker);
            }}
          >
            <Ionicons 
              name={showEmojiPicker ? "close-circle" : "happy-outline"} 
              size={26} 
              color={showEmojiPicker ? "#FF6B6B" : "#075E54"} 
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={inputText}
            onChangeText={handleInputChange}
            onFocus={() => setShowEmojiPicker(false)}
            multiline
            maxLength={1000}
          />

          {inputText.trim() ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleAttachment}
              disabled={uploadingMedia}
            >
              <Ionicons 
                name="add-circle" 
                size={28} 
                color={uploadingMedia ? '#ccc' : '#075E54'} 
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Media Preview Modal */}
      <MediaPreviewModal
        visible={!!mediaPreview}
        mediaAsset={mediaPreview}
        onSend={handleSendMedia}
        onClose={() => setMediaPreview(null)}
        isUploading={uploadingMedia}
      />

      {/* Attachment Bottom Sheet */}
      <AttachmentBottomSheet
        visible={showAttachmentSheet}
        onClose={() => setShowAttachmentSheet(false)}
        onOptionPress={handleAttachmentOption}
      />

      {/* Image Viewer Modal */}
      <Modal
        visible={!!viewingImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewingImage(null)}
      >
        <View style={styles.imageViewerContainer}>
          <TouchableOpacity 
            style={styles.imageViewerClose}
            onPress={() => setViewingImage(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {viewingImage && (
            <Image
              source={{ uri: viewingImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  messageList: {
    padding: 10,
    paddingBottom: 30,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  mediaBubble: {
    maxWidth: '80%',
    padding: 0,
    overflow: 'hidden',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mediaContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  videoPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  captionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 4,
  },
  captionText: {
    color: '#000',
    fontSize: 14,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'flex-end',
  },
  mediaFooter: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  mediaTime: {
    color: '#fff',
    fontSize: 11,
  },
  checkmark: {
    marginLeft: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#ECE5DD',
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 0.4,
  },
  typingText: {
    fontSize: 13,
    color: '#075E54',
    fontStyle: 'italic',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#f0f0f0',
  },
  uploadingText: {
    fontSize: 13,
    color: '#075E54',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: Platform.OS === 'ios' ? 8 : 8,
  },
  emojiButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default ChatRoomScreen;
