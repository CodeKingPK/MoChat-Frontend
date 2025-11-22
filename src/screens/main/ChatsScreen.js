import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatAPI } from '../../services/apiService';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { WS_EVENTS } from '../../config/constants';

const ChatsScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { wsService, onlineUsers } = useWebSocket();

  useEffect(() => {
    fetchChats();
    
    // Listen for new messages via WebSocket
    const handleNewMessage = (message) => {
      updateChatWithNewMessage(message);
    };

    // Listen for new chats
    const handleNewChat = (chatData) => {
      fetchChats(); // Refetch to get the new chat
    };

    wsService.on(WS_EVENTS.MESSAGE, handleNewMessage);
    wsService.on('new_chat', handleNewChat);

    return () => {
      wsService.off(WS_EVENTS.MESSAGE, handleNewMessage);
      wsService.off('new_chat', handleNewChat);
    };
  }, []);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const updateChatWithNewMessage = (message) => {
    setChats(prevChats => {
      const chatId = message.chatId || message.chat;
      const chatIndex = prevChats.findIndex(chat => chat._id === chatId);
      
      if (chatIndex !== -1) {
        // Update existing chat
        const updatedChats = [...prevChats];
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: message,
          updatedAt: message.createdAt || new Date().toISOString(),
        };
        // Move to top
        const [chat] = updatedChats.splice(chatIndex, 1);
        return [chat, ...updatedChats];
      } else {
        // New chat - refetch to get complete chat data
        fetchChats();
        return prevChats;
      }
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderChatItem = ({ item }) => {
    const isOnline = onlineUsers.includes(item.participant?._id);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatRoom', { chat: item })}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: item.participant?.avatar || 'https://via.placeholder.com/50' 
            }}
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.participant?.name || 'Unknown'}
            </Text>
            <Text style={styles.chatTime}>
              {formatTime(item.updatedAt)}
            </Text>
          </View>

          <View style={styles.chatMessageRow}>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage?.text || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No chats yet</Text>
        <Text style={styles.emptySubtext}>
          Start a conversation by searching for users
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#075E54"
            colors={['#075E54']}
          />
        }
        />
      </View>
    </SafeAreaView>
  );
};const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ChatsScreen;
