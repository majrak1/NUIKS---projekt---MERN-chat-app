import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Conversation from '../../components/sidebar/Conversation';
import useGetConversations from '../../hooks/useGetConversations';
import useLogout from '../../hooks/useLogout';

const ConversationsScreen = ({ navigation }) => {
    const { loading, conversations } = useGetConversations();
    const { loading: logoutLoading, logout } = useLogout();

    const handleConversationPress = (conversation) => {
        navigation.navigate('Messages', { conversation });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>N</Text>
                    </View>
                    <Text style={styles.brandText}>NotWhatsApp</Text>
                </View>
                {!logoutLoading ? (
                    <TouchableOpacity onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                ) : (
                    <ActivityIndicator size="small" color="#fff" />
                )}
            </View>

            {/* Conversations List */}
            <View style={styles.content}>
                <Text style={styles.title}>Chats</Text>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#fff" />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => (
                            <Conversation
                                conversation={item}
                                lastIdx={index === conversations.length - 1}
                                onPress={() => handleConversationPress(item)}
                            />
                        )}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 60, // Account for status bar
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconText: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    brandText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    logoutText: {
        fontSize: 14,
        color: '#ccc',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ConversationsScreen;
