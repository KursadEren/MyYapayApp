// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// *** EKRANLAR ***
import Home          from './src/screens/Home';
import Downloads     from './src/screens/Downloads';
import CameraCapture from './src/screens/CameraCapture';
import About         from './src/screens/About';

// Tab objesi
const Tab = createBottomTabNavigator();

// Küçük yardımcı: ikon seçici
const tabIcon = (name) => ({ color, size }) =>
  <FontAwesome6 name={name} size={size} color={color} solid />;

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#1d4ed8',   // active blue-600
          tabBarInactiveTintColor: '#64748b', // slate-400
          tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{ tabBarIcon: tabIcon('house') }}
        />
        <Tab.Screen
          name="Downloads"
          component={Downloads}
          options={{ tabBarIcon: tabIcon('image') }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraCapture}
          options={{ tabBarIcon: tabIcon('camera') }}
        />
        <Tab.Screen
          name="About"
          component={About}
          options={{ tabBarIcon: tabIcon('circle-info') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
