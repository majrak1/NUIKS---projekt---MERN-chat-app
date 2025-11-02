import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import useSendMessage from '../../hooks/useSendMessage';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async () => {
        if (!message.trim()) return;
        await sendMessage(message);
        setMessage('');
    };

    // Simple send icon using text for now (SVG requires react-native-svg library)
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Write a message..."
                    placeholderTextColor="#666"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                />

                <TouchableOpacity
                    style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.sendIcon}>→</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#fff',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendIcon: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default MessageInput;
