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

const PrivacyScreen = ({ navigation }) => {
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState('everyone');
  const [about, setAbout] = useState('everyone');
  const [lastSeen, setLastSeen] = useState('everyone');

  const privacyOptions = ['Everyone', 'My Contacts', 'Nobody'];

  const renderOption = (currentValue, onSelect) => {
    return (
      <View style={styles.optionsContainer}>
        {privacyOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => onSelect(option.toLowerCase().replace(' ', '-'))}
          >
            <Text style={styles.optionText}>{option}</Text>
            {currentValue === option.toLowerCase().replace(' ', '-') && (
              <Ionicons name="checkmark" size={20} color="#075E54" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who can see my personal info</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-circle-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Profile photo</Text>
                <Text style={styles.menuSubtext}>
                  {profilePhoto.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>About</Text>
                <Text style={styles.menuSubtext}>
                  {about.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="time-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Last seen & online</Text>
                <Text style={styles.menuSubtext}>
                  {lastSeen.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="checkmark-done-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Read receipts</Text>
                <Text style={styles.switchSubtext}>
                  If turned off, you won't send or receive Read receipts
                </Text>
              </View>
            </View>
            <Switch
              value={readReceipts}
              onValueChange={setReadReceipts}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="radio-button-on-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Online status</Text>
                <Text style={styles.switchSubtext}>
                  Show when you're online
                </Text>
              </View>
            </View>
            <Switch
              value={onlineStatus}
              onValueChange={setOnlineStatus}
              trackColor={{ false: '#ccc', true: '#128C7E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disappearing messages</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="timer-outline" size={22} color="#666" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Default message timer</Text>
                <Text style={styles.menuSubtext}>Off</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Blocked contacts</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="finger-print-outline" size={22} color="#666" />
            <Text style={styles.menuText}>App lock</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your privacy settings control who can see your information and how you appear to others.
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
  badge: {
    backgroundColor: '#128C7E',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  optionsContainer: {
    backgroundColor: '#f9f9f9',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
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

export default PrivacyScreen;
