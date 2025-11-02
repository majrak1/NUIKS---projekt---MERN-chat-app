import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useConversation from '../../zustand/useConversation';
import MessageInput from '../../components/messages/MessageInput';
import Messages from '../../components/messages/Messages';
import { convertImageUrl } from '../../utils/imageUtils';

const MessagesScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { conversation } = route.params;
    const { setSelectedConversation } = useConversation();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        // Set the selected conversation when screen loads
        setSelectedConversation(conversation);

        // Cleanup when leaving the screen
        return () => {
            setSelectedConversation(null);
        };
    }, [conversation, setSelectedConversation]);

    // Calculate keyboard offset including header height and safe area
    const keyboardOffset = Platform.OS === 'ios' ? insets.top + 60 : 0;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardOffset}
        >
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                
                <View style={styles.avatarContainer}>
                    {conversation.profilePic ? (
                        <Image
                            source={{ uri: convertImageUrl(conversation.profilePic) }}
                            style={styles.avatar}
                            resizeMode="cover"
                            onError={(e) => {
                                console.log('Image load error:', e.nativeEvent.error);
                            }}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>
                                {conversation.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.headerText}>
                    <Text style={styles.headerName}>{conversation.fullName}</Text>
                </View>
            </View>

            {/* Messages */}
            <View style={styles.messagesContainer}>
                <Messages />
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
                <MessageInput />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 60, // Account for status bar
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#1a1a1a',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backButtonText: {
        fontSize: 24,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    messagesContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#1a1a1a',
    },
});

export default MessagesScreen;
