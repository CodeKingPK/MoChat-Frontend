import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/apiService';

const UsernameScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (username.length >= 3 && username !== user?.username) {
      checkUsername();
    } else {
      setAvailable(null);
      setMessage('');
    }
  }, [username]);

  const checkUsername = async () => {
    try {
      setChecking(true);
      const response = await userAPI.checkUsername(username);
      setAvailable(response.available);
      setMessage(response.message);
    } catch (error) {
      setAvailable(false);
      setMessage(error.response?.data?.message || 'Error checking username');
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert('Error', 'Username can only contain letters, numbers, and underscores');
      return;
    }

    if (username === user?.username) {
      navigation.goBack();
      return;
    }

    if (!available) {
      Alert.alert('Error', 'This username is not available');
      return;
    }

    try {
      setSaving(true);
      const response = await userAPI.updateProfile({ username });
      
      if (response.success) {
        updateUser(response.user);
        Alert.alert('Success', 'Username updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Username</Text>
          <Text style={styles.subtitle}>
            Pick a unique username for your account
          </Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            {checking && <ActivityIndicator size="small" color="#075E54" />}
            {!checking && available === true && (
              <Ionicons name="checkmark-circle" size={24} color="#25D366" />
            )}
            {!checking && available === false && (
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            )}
          </View>

          {message && (
            <Text style={[styles.message, available ? styles.success : styles.error]}>
              {message}
            </Text>
          )}

          <View style={styles.guidelines}>
            <Text style={styles.guideTitle}>Username Guidelines:</Text>
            <Text style={styles.guideItem}>• 3-30 characters long</Text>
            <Text style={styles.guideItem}>• Only letters, numbers, and underscores</Text>
            <Text style={styles.guideItem}>• No spaces or special characters</Text>
            <Text style={styles.guideItem}>• Must be unique</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!available || saving) && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={!available || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Username</Text>
            )}
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  atSymbol: {
    fontSize: 18,
    color: '#666',
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
    color: '#000',
  },
  message: {
    fontSize: 14,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  success: {
    color: '#25D366',
  },
  error: {
    color: '#FF3B30',
  },
  guidelines: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  guideItem: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#075E54',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UsernameScreen;
