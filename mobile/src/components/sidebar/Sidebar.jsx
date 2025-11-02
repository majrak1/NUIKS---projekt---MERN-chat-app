import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Conversations from './Conversations';
import useLogout from '../../hooks/useLogout';

const Sidebar = () => {
    const { loading, logout } = useLogout();

    return (
        <View style={styles.container}>
            {/* Brand / top */}
            <View style={styles.brandContainer}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>N</Text>
                </View>
                <Text style={styles.brandText}>NotWhatsApp</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#666"
                    style={styles.searchInput}
                />
            </View>

            {/* Conversations list */}
            <View style={styles.conversationsContainer}>
                <Conversations />
            </View>

            {/* Footer actions */}
            <View style={styles.footer}>
                {!loading ? (
                    <TouchableOpacity onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                ) : (
                    <ActivityIndicator size="small" color="#fff" />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 280,
        backgroundColor: '#1a1a1a',
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: '#333',
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
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
    searchContainer: {
        marginBottom: 12,
    },
    searchInput: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: '#fff',
    },
    conversationsContainer: {
        flex: 1,
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    logoutText: {
        fontSize: 14,
        color: '#ccc',
    },
});

export default Sidebar;
