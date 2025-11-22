import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = ({ navigation }) => {
  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@mochat.com'),
        },
      ]
    );
  };

  const handleOpenFAQ = () => {
    // TODO: Navigate to FAQ screen or open web FAQ
    Alert.alert('FAQ', 'Opening Frequently Asked Questions...');
  };

  const handleReportProblem = () => {
    Alert.alert(
      'Report a Problem',
      'Please describe the issue you are experiencing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // TODO: Navigate to problem report form
            Alert.alert('Thank you', 'We will review your report shortly.');
          },
        },
      ]
    );
  };

  const handleOpenTerms = () => {
    // TODO: Open terms of service
    Alert.alert('Terms of Service', 'Opening Terms of Service...');
  };

  const handleOpenPrivacyPolicy = () => {
    // TODO: Open privacy policy
    Alert.alert('Privacy Policy', 'Opening Privacy Policy...');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleOpenFAQ}>
            <Ionicons name="help-circle-outline" size={22} color="#666" />
            <Text style={styles.menuText}>FAQ</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleContactSupport}>
            <Ionicons name="mail-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Contact us</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleReportProblem}>
            <Ionicons name="warning-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Report a problem</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleOpenTerms}>
            <Ionicons name="document-text-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleOpenPrivacyPolicy}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="people-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Community Guidelines</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <Text style={styles.infoValue}>100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guides</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="book-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Getting started</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bulb-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Tips & Tricks</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="star-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Rate MoChat</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="share-social-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Tell a friend</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MoChat</Text>
          <Text style={styles.footerSubtext}>
            © 2024 MoChat Inc. All rights reserved.
          </Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ for secure communication
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
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#075E54',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default HelpScreen;
