import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config/constants';

const CallsScreen = ({ navigation }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/calls/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCalls(data.calls);
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCallHistory();
  };

  const formatCallTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 60) return `${diff} minute${diff !== 1 ? 's' : ''} ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hour${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (type, status) => {
    if (status === 'missed') {
      return { name: 'call', color: '#FF3B30' };
    }
    if (status === 'incoming') {
      return { name: 'arrow-down', color: '#25D366' };
    }
    return { name: 'arrow-up', color: '#999' };
  };

  const renderCallItem = ({ item }) => {
    const callIcon = getCallIcon(item.type, item.status);
    const otherUser = item.isOutgoing ? item.receiver : item.caller;

    return (
      <TouchableOpacity 
        style={styles.callItem}
        onPress={() => navigation.navigate('Calling', {
          user: otherUser,
          callType: item.type,
          isOutgoing: true,
        })}
      >
        <Image 
          source={{ uri: otherUser?.avatar || 'https://via.placeholder.com/50' }} 
          style={styles.avatar} 
        />

        <View style={styles.callInfo}>
          <Text style={[styles.userName, item.status === 'missed' && styles.missedCall]}>
            {otherUser?.name || 'Unknown'}
          </Text>
          <View style={styles.callDetails}>
            <Ionicons name={callIcon.name} size={16} color={callIcon.color} />
            <Text style={styles.callType}>
              {item.type === 'video' ? 'Video' : 'Audio'} • {formatCallTime(item.createdAt)}
            </Text>
          </View>
          {item.duration && (
            <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => navigation.navigate('Calling', {
            user: otherUser,
            callType: item.type,
            isOutgoing: true,
          })}
        >
          <Ionicons
            name={item.type === 'video' ? 'videocam' : 'call'}
            size={22}
            color="#075E54"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#075E54" />
          </View>
        ) : calls.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="call-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No recent calls</Text>
            <Text style={styles.emptySubtext}>
              Make your first call to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={calls}
            renderItem={renderCallItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#075E54']}
                tintColor="#075E54"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
  },
  callInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  missedCall: {
    color: '#FF3B30',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  duration: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  callButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default CallsScreen;
