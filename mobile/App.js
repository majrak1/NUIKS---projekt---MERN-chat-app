import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContextProvider, useAuthContext } from './src/context/AuthContext';
import { SocketContextProvider } from './src/context/SocketContext';
import Login from './src/pages/login/LogIn';
import SignUp from './src/pages/signup/SignUp';
import ConversationsScreen from './src/pages/conversations/ConversationsScreen';
import MessagesScreen from './src/pages/messages/MessagesScreen';

const Stack = createNativeStackNavigator();

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
                    <>
                        <Stack.Screen name="Conversations" component={ConversationsScreen} />
                        <Stack.Screen name="Messages" component={MessagesScreen} />
                    </>
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
