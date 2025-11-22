import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ChatsScreen = ({ navigation }) => {
  const [enterToSend, setEnterToSend] = useState(false);
  const [mediaVisibility, setMediaVisibility] = useState(true);
  const [saveToGallery, setSaveToGallery] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  const handleBackupChat = () => {
    Alert.alert(
      'Backup Chats',
      'This feature will backup your chat history to cloud storage.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Backup Now', onPress: () => {
          // TODO: Implement backup functionality
          Alert.alert('Success', 'Chats backed up successfully');
        }},
      ]
    );
  };

  const handleClearAllChats = () => {
    Alert.alert(
      'Clear All Chats',
      'Are you sure you want to clear all chat history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clear chats functionality
            Alert.alert('Cleared', 'All chats have been cleared');
          }
        },
      ]
    );
  };

  const handleExportChats = () => {
    Alert.alert(
      'Export Chats',
      'Export your chat history as a text file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement export functionality
          Alert.alert('Success', 'Chats exported successfully');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="color-palette-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Theme</Text>
                <Text style={styles.menuSubtext}>System default</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="image-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Wallpaper</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="text-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Font size</Text>
                <Text style={styles.menuSubtext}>
                  {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Settings</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="return-down-back-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Enter is send</Text>
                <Text style={styles.switchSubtext}>
                  Press Enter to send messages
                </Text>
              </View>
            </View>
            <Switch
              value={enterToSend}
              onValueChange={setEnterToSend}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="images-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Media visibility</Text>
                <Text style={styles.switchSubtext}>
                  Show newly received media in your phone's gallery
                </Text>
              </View>
            </View>
            <Switch
              value={mediaVisibility}
              onValueChange={setMediaVisibility}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="download-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Save to gallery</Text>
                <Text style={styles.switchSubtext}>
                  Automatically save photos and videos
                </Text>
              </View>
            </View>
            <Switch
              value={saveToGallery}
              onValueChange={setSaveToGallery}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Archived Chats</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="archive-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Keep chats archived</Text>
                <Text style={styles.menuSubtext}>
                  Archived chats will remain archived when you receive a new message
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleBackupChat}>
            <Ionicons name="cloud-upload-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Backup chats</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleExportChats}>
            <Ionicons name="share-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Export chats</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="calendar-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Last backup</Text>
                <Text style={styles.menuSubtext}>Never</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleClearAllChats}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            <Text style={styles.dangerText}>Clear all chats</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Customize your chat experience and manage your chat history.
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
    fontSize: 16,
    color: '#000',
  },
  menuSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF5F5',
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  dangerText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 15,
    fontWeight: '500',
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

export default ChatsScreen;
