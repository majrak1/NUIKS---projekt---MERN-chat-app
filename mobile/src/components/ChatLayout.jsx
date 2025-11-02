import React from 'react';
import { View, StyleSheet } from 'react-native';
import Sidebar from './sidebar/Sidebar';
import MessageContainer from './messages/MessageContainer';

const ChatLayout = () => {
    return (
        <View style={styles.container}>
            <Sidebar />
            <MessageContainer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
});

export default ChatLayout;
