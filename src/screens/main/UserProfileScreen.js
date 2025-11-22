import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { userAPI } from '../../services/apiService';
import MediaGallery from '../../components/MediaGallery';

const UserProfileScreen = ({ route, navigation }) => {
  const { user: initialUser, chatId } = route.params;
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const [activeTab, setActiveTab] = useState('media');

  useEffect(() => {
    if (initialUser?._id) {
      fetchUserProfile();
    }
  }, [initialUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUser(initialUser._id);
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioCall = () => {
    navigation.navigate('Calling', {
      user,
      callType: 'audio',
      isOutgoing: true,
    });
  };

  const handleVideoCall = () => {
    navigation.navigate('Calling', {
      user,
      callType: 'video',
      isOutgoing: true,
    });
  };

  const handlePhoneCall = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    } else {
      Alert.alert('No Phone Number', 'This user has not added a phone number');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || 'Unknown User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.aboutText}>
            {user?.status || 'Hey there! I am using MoChat'}
          </Text>
        </View>

        {/* Phone Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phone</Text>
          <Text style={styles.infoText}>{user?.phone || 'Not available'}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAudioCall}>
            <Ionicons name="call" size={24} color="#075E54" />
            <Text style={styles.actionText}>Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={24} color="#075E54" />
            <Text style={styles.actionText}>Video</Text>
          </TouchableOpacity>

          {user?.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handlePhoneCall}>
              <Ionicons name="phone-portrait" size={24} color="#075E54" />
              <Text style={styles.actionText}>Phone</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'media' && styles.activeTab]}
            onPress={() => setActiveTab('media')}
          >
            <Text style={[styles.tabText, activeTab === 'media' && styles.activeTabText]}>
              Media
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'links' && styles.activeTab]}
            onPress={() => setActiveTab('links')}
          >
            <Text style={[styles.tabText, activeTab === 'links' && styles.activeTabText]}>
              Links
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'docs' && styles.activeTab]}
            onPress={() => setActiveTab('docs')}
          >
            <Text style={[styles.tabText, activeTab === 'docs' && styles.activeTabText]}>
              Docs
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>

        {/* Tab Content - Outside ScrollView to prevent VirtualizedList nesting */}
        <View style={styles.tabContent}>
          {activeTab === 'media' && (
            chatId ? (
              <MediaGallery chatId={chatId} userId={user?._id} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="image-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No chat available</Text>
              </View>
            )
          )}

          {activeTab === 'links' && (
            <View style={styles.emptyState}>
              <Ionicons name="link-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No links shared yet</Text>
            </View>
          )}

          {activeTab === 'docs' && (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No documents shared yet</Text>
            </View>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="ban-outline" size={22} color="#FF3B30" />
            <Text style={styles.dangerText}>Block User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="flag-outline" size={22} color="#FF3B30" />
            <Text style={styles.dangerText}>Report User</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#f6f6f6',
  },
  scrollContent: {
    flexGrow: 0,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 16,
    color: '#000',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 8,
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 14,
    color: '#075E54',
    marginTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#075E54',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#075E54',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
  },
  dangerZone: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
});

export default UserProfileScreen;
