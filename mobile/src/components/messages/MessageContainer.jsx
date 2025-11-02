import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import useConversation from '../../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { useAuthContext } from '../../context/AuthContext';

const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    if (!selectedConversation) {
        return <NoChatSelected />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: selectedConversation.profilePic }}
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.headerName}>{selectedConversation.fullName}</Text>
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
        </View>
    );
};

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <View style={styles.noChatContainer}>
            <Text style={styles.noChatText}>Welcome {authUser?.fullName}!</Text>
            <Text style={styles.noChatSubtext}>Select a chat to start messaging</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'transparent',
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
    },
    headerText: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
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
        backgroundColor: 'transparent',
    },
    noChatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noChatText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 8,
    },
    noChatSubtext: {
        fontSize: 16,
        color: '#999',
    },
});

export default MessageContainer;
