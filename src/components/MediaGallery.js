import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatAPI } from '../services/apiService';
import VideoPlayer from './VideoPlayer';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 6) / 3; // 3 columns with 2px gaps

const MediaGallery = ({ chatId, userId }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'images', 'videos'

  useEffect(() => {
    if (chatId) {
      fetchMediaFromChat();
    }
  }, [chatId, filter]);

  const fetchMediaFromChat = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getMessages(chatId, 1, 500);
      
      // Filter messages to get only media
      const mediaMessages = response.messages.filter(msg => 
        msg.type === 'image' || msg.type === 'video'
      );

      // Apply filter
      let filteredMedia = mediaMessages;
      if (filter === 'images') {
        filteredMedia = mediaMessages.filter(m => m.type === 'image');
      } else if (filter === 'videos') {
        filteredMedia = mediaMessages.filter(m => m.type === 'video');
      }

      setMedia(filteredMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => setSelectedMedia(item)}
    >
      {item.type === 'image' ? (
        <Image
          source={{ uri: item.mediaUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.thumbnail}>
          <Image
            source={{ uri: item.mediaUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFullScreenMedia = () => {
    if (!selectedMedia) return null;

    return (
      <Modal
        visible={!!selectedMedia}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedMedia(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedMedia(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          {selectedMedia.type === 'image' ? (
            <Image
              source={{ uri: selectedMedia.mediaUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.videoContainer}>
              <VideoPlayer
                uri={selectedMedia.mediaUrl}
                width={width}
                height={width * (16 / 9)}
              />
            </View>
          )}

          <View style={styles.mediaInfo}>
            <Text style={styles.mediaDate}>
              {new Date(selectedMedia.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Loading media...</Text>
      </View>
    );
  }

  if (media.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No media shared yet</Text>
        <Text style={styles.emptySubtext}>
          Photos and videos you share will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({media.filter(m => m.type === 'image' || m.type === 'video').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'images' && styles.filterButtonActive]}
          onPress={() => setFilter('images')}
        >
          <Text style={[styles.filterText, filter === 'images' && styles.filterTextActive]}>
            Photos ({media.filter(m => m.type === 'image').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'videos' && styles.filterButtonActive]}
          onPress={() => setFilter('videos')}
        >
          <Text style={[styles.filterText, filter === 'videos' && styles.filterTextActive]}>
            Videos ({media.filter(m => m.type === 'video').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Media grid */}
      <FlatList
        data={media}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item._id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Full screen viewer */}
      {renderFullScreenMedia()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#075E54',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  grid: {
    padding: 1,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: width,
    height: '80%',
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  mediaDate: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MediaGallery;
