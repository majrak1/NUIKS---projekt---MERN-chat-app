import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Conversation from './Conversation';
import useGetConversations from '../../hooks/useGetConversations';

const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chats</Text>
            </View>

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
                        />
                    )}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
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

export default Conversations;
