import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const StorageScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    total: '0 MB',
    chats: '0 MB',
    media: '0 MB',
    documents: '0 MB',
    cache: '0 MB',
  });

  useEffect(() => {
    calculateStorage();
  }, []);

  const calculateStorage = async () => {
    setLoading(true);
    // TODO: Implement actual storage calculation
    // Simulating storage data
    setTimeout(() => {
      setStorageInfo({
        total: '124 MB',
        chats: '45 MB',
        media: '67 MB',
        documents: '8 MB',
        cache: '4 MB',
      });
      setLoading(false);
    }, 1000);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will free up storage space by clearing cached data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            // TODO: Implement cache clearing
            Alert.alert('Success', 'Cache cleared successfully');
            calculateStorage();
          },
        },
      ]
    );
  };

  const handleManageStorage = () => {
    Alert.alert(
      'Manage Storage',
      'Delete old media and messages to free up space.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // TODO: Navigate to storage management screen
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Usage</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#075E54" />
              <Text style={styles.loadingText}>Calculating storage...</Text>
            </View>
          ) : (
            <>
              <View style={styles.totalContainer}>
                <Ionicons name="phone-portrait-outline" size={48} color="#075E54" />
                <Text style={styles.totalSize}>{storageInfo.total}</Text>
                <Text style={styles.totalLabel}>Total MoChat Storage</Text>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageLeft}>
                  <Ionicons name="chatbubbles-outline" size={22} color="#666" />
                  <Text style={styles.storageText}>Chats</Text>
                </View>
                <Text style={styles.storageValue}>{storageInfo.chats}</Text>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageLeft}>
                  <Ionicons name="images-outline" size={22} color="#666" />
                  <Text style={styles.storageText}>Media</Text>
                </View>
                <Text style={styles.storageValue}>{storageInfo.media}</Text>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageLeft}>
                  <Ionicons name="document-outline" size={22} color="#666" />
                  <Text style={styles.storageText}>Documents</Text>
                </View>
                <Text style={styles.storageValue}>{storageInfo.documents}</Text>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageLeft}>
                  <Ionicons name="cube-outline" size={22} color="#666" />
                  <Text style={styles.storageText}>Cache</Text>
                </View>
                <Text style={styles.storageValue}>{storageInfo.cache}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Storage</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleManageStorage}>
            <Ionicons name="folder-open-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Manage storage</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
            <Ionicons name="trash-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Clear cache</Text>
            <Text style={styles.cacheSize}>{storageInfo.cache}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={calculateStorage}>
            <Ionicons name="refresh-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Recalculate storage</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network Usage</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="cellular-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Mobile data usage</Text>
                <Text style={styles.menuSubtext}>Not available</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="wifi-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>WiFi usage</Text>
                <Text style={styles.menuSubtext}>Not available</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto-download Media</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="camera-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>When using mobile data</Text>
                <Text style={styles.menuSubtext}>Photos</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="wifi-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>When connected on WiFi</Text>
                <Text style={styles.menuSubtext}>All media</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="globe-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>When roaming</Text>
                <Text style={styles.menuSubtext}>No media</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Manage your storage usage and control how media is downloaded.
          </Text>
        </View>
      </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#075E54',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  totalContainer: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalSize: {
    fontSize: 32,
    fontWeight: '700',
    color: '#075E54',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
  storageValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
  menuSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  cacheSize: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default StorageScreen;
