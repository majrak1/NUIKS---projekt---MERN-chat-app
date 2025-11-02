import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSocketContext } from '../../context/SocketContext';
import useConversation from '../../zustand/useConversation';
import { convertImageUrl } from '../../utils/imageUtils';

const Conversation = ({ conversation, lastIdx, onPress }) => {
    const { selectedConversation } = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <TouchableOpacity
                style={[
                    styles.container,
                    isSelected && styles.containerSelected,
                ]}
                onPress={onPress || (() => { })}
                activeOpacity={0.7}
            >
                <View style={[styles.avatarContainer, isOnline && styles.avatarOnline]}>
                    {conversation.profilePic ? (
                        <Image
                            source={{ uri: convertImageUrl(conversation.profilePic) }}
                            style={styles.avatar}
                            resizeMode="cover"
                            onError={(e) => {
                                console.log('Image load error for:', conversation.profilePic);
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

                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.name,
                            isSelected && styles.nameSelected,
                        ]}
                    >
                        {conversation.fullName}
                    </Text>
                </View>
            </TouchableOpacity>

            {!lastIdx && <View style={styles.divider} />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginVertical: 2,
    },
    containerSelected: {
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOnline: {
        borderColor: '#007AFF',
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
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ccc',
    },
    nameSelected: {
        color: '#007AFF',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 4,
        marginLeft: 68,
    },
});

export default Conversation;
