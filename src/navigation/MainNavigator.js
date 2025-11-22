import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Platform, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import ChatsScreen from '../screens/main/ChatsScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import SearchUsersScreen from '../screens/main/SearchUsersScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import UserProfileScreen from '../screens/main/UserProfileScreen';
import UpdatesScreen from '../screens/main/UpdatesScreen';
import CallsScreen from '../screens/main/CallsScreen';
import CallingScreen from '../screens/main/CallingScreen';
import QRCodeScreen from '../screens/main/QRCodeScreen';
import UsernameScreen from '../screens/main/UsernameScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import PrivacyScreen from '../screens/settings/PrivacyScreen';
import ChatsSettingsScreen from '../screens/settings/ChatsScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import StorageScreen from '../screens/settings/StorageScreen';
import HelpScreen from '../screens/settings/HelpScreen';

import IncomingCallModal from '../components/IncomingCallModal';
import { setupIncomingCallHandler, removeIncomingCallHandler, setNavigationRef } from '../services/callManager';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ChatsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatsList" 
        component={ChatsScreen}
        options={({ navigation }) => ({
          title: 'MoChat',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchUsers')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="SearchUsers" 
        component={SearchUsersScreen}
        options={{
          title: 'New Chat',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen}
        options={{
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          title: 'Contact Info',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Calling" 
        component={CallingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UpdatesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UpdatesList" 
        component={UpdatesScreen}
        options={{
          title: 'Updates',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
};

const CallsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CallsList" 
        component={CallsScreen}
        options={{
          title: 'Calls',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="QRCode" 
        component={QRCodeScreen}
        options={{
          title: 'QR Code',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Username" 
        component={UsernameScreen}
        options={{
          title: 'Username',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          title: 'Account',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{
          title: 'Privacy',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Chats" 
        component={ChatsSettingsScreen}
        options={{
          title: 'Chats',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Storage" 
        component={StorageScreen}
        options={{
          title: 'Storage and Data',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{
          title: 'Help',
          headerStyle: { backgroundColor: '#075E54' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const navigationRef = useRef(null);

  useEffect(() => {
    // Setup incoming call handler
    setupIncomingCallHandler();
    
    return () => {
      removeIncomingCallHandler();
    };
  }, []);

  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, [navigationRef.current]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#075E54',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 5,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}
    >
      <Tab.Screen 
        name="Chats" 
        component={ChatsStack}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (routeName === 'ChatRoom' || routeName === 'SearchUsers' || routeName === 'UserProfile') {
              return { display: 'none' };
            }
            return {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: Platform.OS === 'ios' ? 85 : 60,
              paddingBottom: Platform.OS === 'ios' ? 25 : 5,
              paddingTop: 5,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
            };
          })(route),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={size} 
              color={color} 
            />
          ),
        })}
      />
      <Tab.Screen 
        name="Updates" 
        component={UpdatesStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'radio-button-on' : 'radio-button-on-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Calls" 
        component={CallsStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'call' : 'call-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';
            if (routeName === 'EditProfile' || routeName === 'QRCode' || routeName === 'Username' || 
                routeName === 'Account' || routeName === 'Privacy' || routeName === 'Chats' || 
                routeName === 'Notifications' || routeName === 'Storage' || routeName === 'Help') {
              return { display: 'none' };
            }
            return {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: Platform.OS === 'ios' ? 85 : 60,
              paddingBottom: Platform.OS === 'ios' ? 25 : 5,
              paddingTop: 5,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
            };
          })(route),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'settings' : 'settings-outline'} 
              size={size} 
              color={color} 
            />
          ),
        })}
      />
    </Tab.Navigator>
    
      {/* Global Incoming Call Modal */}
      <IncomingCallModal />
    </View>
  );
};

export default MainNavigator;
