import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import { extractTime } from '../../utils/extractTime';
import useConversation from '../../zustand/useConversation';
import { convertImageUrl } from '../../utils/imageUtils';

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;

    return (
        <View style={[styles.container, fromMe ? styles.containerRight : styles.containerLeft]}>
            {!fromMe && (
                <View style={styles.avatarContainer}>
                    {profilePic ? (
                        <Image
                            source={{ uri: convertImageUrl(profilePic) }}
                            style={styles.avatar}
                            resizeMode="cover"
                            onError={(e) => {
                                console.log('Image load error:', e.nativeEvent.error);
                            }}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>
                                {selectedConversation?.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            <View style={[styles.messageContent, { alignItems: fromMe ? 'flex-end' : 'flex-start' }]}>
                <View
                    style={[
                        styles.bubble,
                        fromMe ? styles.bubbleRight : styles.bubbleLeft,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            fromMe ? styles.messageTextRight : styles.messageTextLeft,
                        ]}
                    >
                        {message.message}
                    </Text>
                </View>
                <Text style={styles.timeText}>{formattedTime}</Text>
            </View>

            {fromMe && (
                <View style={styles.avatarContainer}>
                    {profilePic ? (
                        <Image
                            source={{ uri: convertImageUrl(profilePic) }}
                            style={styles.avatar}
                            resizeMode="cover"
                            onError={(e) => {
                                console.log('Image load error:', e.nativeEvent.error);
                            }}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarPlaceholderText}>
                                {authUser?.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
        gap: 8,
    },
    containerLeft: {
        justifyContent: 'flex-start',
    },
    containerRight: {
        justifyContent: 'flex-end',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
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
        fontSize: 14,
        fontWeight: 'bold',
    },
    messageContent: {
        maxWidth: '70%',
    },
    bubble: {
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxWidth: '100%',
    },
    bubbleRight: {
        backgroundColor: '#007AFF',
    },
    bubbleLeft: {
        backgroundColor: '#2a2a2a',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    messageText: {
        fontSize: 15,
    },
    messageTextRight: {
        color: '#fff',
    },
    messageTextLeft: {
        color: '#fff',
    },
    timeText: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
        paddingHorizontal: 4,
    },
});

export default Message;
