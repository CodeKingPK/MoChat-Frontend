import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const UpdatesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [myStatus, setMyStatus] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [viewedUpdates, setViewedUpdates] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching status updates
    setRecentUpdates([
      {
        id: '1',
        user: { name: 'John Doe', avatar: 'https://via.placeholder.com/50' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        viewed: false,
      },
      {
        id: '2',
        user: { name: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        viewed: false,
      },
    ]);

    setViewedUpdates([
      {
        id: '3',
        user: { name: 'Mike Johnson', avatar: 'https://via.placeholder.com/50' },
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        viewed: true,
      },
    ]);
  }, []);

  const formatStatusTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return 'Yesterday';
  };

  const renderStatusItem = ({ item }) => (
    <TouchableOpacity style={styles.statusItem}>
      <View style={[styles.statusAvatarContainer, !item.viewed && styles.unviewedBorder]}>
        <Image source={{ uri: item.user.avatar }} style={styles.statusAvatar} />
      </View>
      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{item.user.name}</Text>
        <Text style={styles.statusTime}>{formatStatusTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>

          {/* My Status */}
          <TouchableOpacity style={styles.myStatus}>
            <View style={styles.statusAvatarContainer}>
              <Image
                source={{ uri: user?.avatar || 'https://via.placeholder.com/50' }}
                style={styles.statusAvatar}
              />
              <View style={styles.addStatusButton}>
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.myStatusText}>My status</Text>
              <Text style={styles.statusSubtext}>Tap to add status update</Text>
            </View>
          </TouchableOpacity>

          {/* Recent Updates */}
          {recentUpdates.length > 0 && (
            <>
              <Text style={styles.updatesHeader}>Recent updates</Text>
              <FlatList
                data={recentUpdates}
                renderItem={renderStatusItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}

          {/* Viewed Updates */}
          {viewedUpdates.length > 0 && (
            <>
              <Text style={styles.updatesHeader}>Viewed updates</Text>
              <FlatList
                data={viewedUpdates}
                renderItem={renderStatusItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
        </View>

        {/* Channels Section (Future Feature) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="megaphone-outline" size={24} color="#075E54" />
            <Text style={styles.channelsTitle}>Channels</Text>
          </View>
          <Text style={styles.channelsSubtext}>
            Stay updated on topics that matter to you. Find channels to follow below.
          </Text>
          <TouchableOpacity style={styles.findChannelsButton}>
            <Text style={styles.findChannelsText}>Find channels</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Camera Button */}
      <TouchableOpacity style={styles.cameraButton}>
        <Ionicons name="camera" size={24} color="#fff" />
      </TouchableOpacity>
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
    backgroundColor: '#f6f6f6',
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  myStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusAvatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  unviewedBorder: {
    borderWidth: 3,
    borderColor: '#25D366',
    borderRadius: 30,
    padding: 2,
  },
  statusAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  addStatusButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#25D366',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusInfo: {
    flex: 1,
  },
  myStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  updatesHeader: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f6f6f6',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  statusTime: {
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  channelsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  channelsSubtext: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 15,
    paddingVertical: 10,
    lineHeight: 20,
  },
  findChannelsButton: {
    backgroundColor: '#E7F8EE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginHorizontal: 15,
    marginTop: 5,
  },
  findChannelsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#075E54',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#075E54',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default UpdatesScreen;
