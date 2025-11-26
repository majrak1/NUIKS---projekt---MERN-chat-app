import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContextProvider, useAuthContext } from './src/context/AuthContext';
import { SocketContextProvider } from './src/context/SocketContext';
import Login from './src/pages/login/LogIn';
import SignUp from './src/pages/signup/SignUp';
import ConversationsScreen from './src/pages/conversations/ConversationsScreen';
import MessagesScreen from './src/pages/messages/MessagesScreen';
import FilesScreen from './src/pages/files/FilesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Messages Stack Navigator
const MessagesStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#000' },
            }}
        >
            <Stack.Screen name="ConversationsList" component={ConversationsScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
        </Stack.Navigator>
    );
};

// Bottom Tab Navigator for authenticated users
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4F46E5',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#111',
                    borderTopColor: '#222',
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: -5,
                },
            }}
        >
            <Tab.Screen
                name="MessagesTab"
                component={MessagesStackNavigator}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size, color }}>💬</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="FilesTab"
                component={FilesScreen}
                options={{
                    tabBarLabel: 'Files',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size, color }}>📄</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { authUser, loading } = useAuthContext();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#000' },
                }}
            >
                {authUser ? (
                    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthContextProvider>
                <SocketContextProvider>
                    <StatusBar style="light" />
                    <AppNavigator />
                </SocketContextProvider>
            </AuthContextProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
