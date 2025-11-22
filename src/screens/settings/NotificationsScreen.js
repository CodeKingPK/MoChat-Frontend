import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(true);
  const [showPreviews, setShowPreviews] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [inAppSounds, setInAppSounds] = useState(true);
  const [inAppVibrate, setInAppVibrate] = useState(false);
  const [callNotifications, setCallNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message Notifications</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Show notifications</Text>
              </View>
            </View>
            <Switch
              value={showNotifications}
              onValueChange={setShowNotifications}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="eye-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Show previews</Text>
                <Text style={styles.switchSubtext}>
                  Show sender and message text in notifications
                </Text>
              </View>
            </View>
            <Switch
              value={showPreviews}
              onValueChange={setShowPreviews}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
              disabled={!showNotifications}
            />
          </View>

          <TouchableOpacity 
            style={[styles.menuItem, !showNotifications && styles.disabled]}
            disabled={!showNotifications}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="musical-notes-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Notification sound</Text>
                <Text style={styles.menuSubtext}>Default</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Vibrate</Text>
              </View>
            </View>
            <Switch
              value={vibrate}
              onValueChange={setVibrate}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
              disabled={!showNotifications}
            />
          </View>

          <TouchableOpacity 
            style={[styles.menuItem, !showNotifications && styles.disabled]}
            disabled={!showNotifications}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="bulb-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Light</Text>
                <Text style={styles.menuSubtext}>White</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Call Notifications</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="call-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Call notifications</Text>
              </View>
            </View>
            <Switch
              value={callNotifications}
              onValueChange={setCallNotifications}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity 
            style={[styles.menuItem, !callNotifications && styles.disabled]}
            disabled={!callNotifications}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="musical-notes-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Ringtone</Text>
                <Text style={styles.menuSubtext}>Default</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Vibrate</Text>
              </View>
            </View>
            <Switch
              value={vibrate}
              onValueChange={setVibrate}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
              disabled={!callNotifications}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>In-App Notifications</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="volume-high-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>In-app sounds</Text>
                <Text style={styles.switchSubtext}>
                  Play sounds for incoming and outgoing messages
                </Text>
              </View>
            </View>
            <Switch
              value={inAppSounds}
              onValueChange={setInAppSounds}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>In-app vibrate</Text>
              </View>
            </View>
            <Switch
              value={inAppVibrate}
              onValueChange={setInAppVibrate}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Do Not Disturb</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="moon-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Quiet hours</Text>
                <Text style={styles.menuSubtext}>Off</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="browsers-outline" size={22} color="#666" />
            <Text style={styles.menuText}>High priority notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Control how you receive notifications for messages and calls.
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
  disabled: {
    opacity: 0.5,
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

export default NotificationsScreen;
