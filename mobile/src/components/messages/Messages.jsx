import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Keyboard, ActivityIndicator } from 'react-native';
import useGetMessages from '../../hooks/useGetMessages';
import Message from './Message';
import useListenMessages from '../../hooks/useListenMessages';

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessages();
    const flatListRef = useRef(null);

    // Keyboard listener - must be before any conditional returns
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    if (loading && messages.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
            </View>
        );
    }

    if (!loading && messages.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
            </View>
        );
    }

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Message message={item} />}
            contentContainerStyle={styles.container}
            onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        gap: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
});

export default Messages;
