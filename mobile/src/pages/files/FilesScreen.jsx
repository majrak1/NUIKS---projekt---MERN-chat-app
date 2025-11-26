import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert, Platform, Modal, SafeAreaView } from 'react-native';
import useGetFiles from '../../hooks/useGetFiles';
import useGetFile from '../../hooks/useGetFile';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FilesScreen = ({ navigation }) => {
    const { loading, files, refetch } = useGetFiles();
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { loading: previewLoading, file: selectedFile } = useGetFile(selectedFileId);

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            if (result.canceled) {
                return;
            }

            await handleUpload(result.assets[0]);
        } catch (error) {
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const handleUpload = async (file) => {
        try {
            setUploading(true);

            const getApiBaseUrl = () => {
                if (process.env.EXPO_PUBLIC_API_BASE_URL) {
                    return process.env.EXPO_PUBLIC_API_BASE_URL;
                }
                if (Platform.OS === 'android') {
                    return "http://10.0.2.2:2100";
                } else {
                    return "http://localhost:2100";
                }
            };

            const API_BASE_URL = getApiBaseUrl();

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                type: file.mimeType || 'application/pdf',
                name: file.name,
            });

            const userStr = await AsyncStorage.getItem('chat-user');
            const headers = userStr ? {} : {};

            const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
                method: 'POST',
                body: formData,
                headers: headers,
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed with status ${response.status}`);
            }

            Alert.alert('Success', 'File uploaded successfully');
            setUploading(false);
            // Refresh the files list
            await refetch();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to upload file');
            setUploading(false);
        }
    };

    const handleFilePress = (fileId) => {
        setSelectedFileId(fileId);
        setShowPreview(true);
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setSelectedFileId(null);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Files</Text>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleSelectFile}
                    disabled={uploading}
                >
                    <Text style={styles.uploadButtonText}>
                        {uploading ? 'Uploading...' : '+ Upload'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Files List */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                ) : files.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No files yet</Text>
                    </View>
                ) : (
                    <ScrollView>
                        {files.map((file, index) => (
                            <TouchableOpacity
                                key={file._id || index}
                                style={styles.fileItem}
                                onPress={() => handleFilePress(file._id)}
                            >
                                <View style={styles.fileIcon}>
                                    <Text style={styles.fileIconText}>📄</Text>
                                </View>
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName} numberOfLines={1}>
                                        {file.filename}
                                    </Text>
                                    <Text style={styles.fileDate}>
                                        {new Date(file.uploadDate).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.fileArrow}>
                                    <Text style={styles.arrowText}>›</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Preview Modal */}
            <Modal
                visible={showPreview}
                animationType="slide"
                transparent={false}
            >
                <SafeAreaView style={styles.previewContainer}>
                    {/* Preview Header */}
                    <View style={styles.previewHeader}>
                        <TouchableOpacity onPress={handleClosePreview}>
                            <Text style={styles.closeButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.previewTitle} numberOfLines={1}>
                            {selectedFile?.filename || 'File Preview'}
                        </Text>
                        <View style={{ width: 50 }} />
                    </View>

                    {/* Preview Content */}
                    <View style={styles.previewContent}>
                        {previewLoading ? (
                            <View style={styles.previewLoadingContainer}>
                                <ActivityIndicator size="large" color="#4F46E5" />
                            </View>
                        ) : selectedFile ? (
                            <ScrollView style={styles.pdfPreviewContainer}>
                                <View style={styles.pdfInfo}>
                                    <Text style={styles.pdfFilename}>{selectedFile.filename}</Text>
                                    <Text style={styles.pdfUploadDate}>
                                        Uploaded: {new Date(selectedFile.uploadDate).toLocaleString()}
                                    </Text>
                                    {selectedFile.fileSize && (
                                        <Text style={styles.pdfFileSize}>
                                            Size: {(selectedFile.fileSize / 1024).toFixed(2)} KB
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.pdfPreviewNote}>
                                    <Text style={styles.pdfPreviewNoteText}>
                                        📄 PDF Preview
                                    </Text>
                                    <Text style={styles.pdfPreviewNoteSubtext}>
                                        To view the full PDF content, use a PDF viewer app
                                    </Text>
                                </View>

                                {selectedFile.data && (
                                    <View style={styles.pdfDataSection}>
                                        <Text style={styles.pdfDataTitle}>File Information</Text>
                                        <Text style={styles.pdfDataText}>
                                            Type: {selectedFile.data.contentType || 'application/pdf'}
                                        </Text>
                                        <Text style={styles.pdfDataText}>
                                            Status: Ready for download or viewing
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        ) : (
                            <View style={styles.previewLoadingContainer}>
                                <Text style={styles.errorText}>Unable to load file preview</Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    uploadButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
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
        color: '#888',
        fontSize: 16,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 8,
        backgroundColor: '#111',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#222',
    },
    fileIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fileIconText: {
        fontSize: 24,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    fileDate: {
        color: '#888',
        fontSize: 12,
    },
    fileArrow: {
        marginLeft: 8,
    },
    arrowText: {
        color: '#666',
        fontSize: 20,
    },
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    closeButtonText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '600',
    },
    previewTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    previewContent: {
        flex: 1,
    },
    previewLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfPreviewContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    pdfInfo: {
        backgroundColor: '#111',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    pdfFilename: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    pdfUploadDate: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
    },
    pdfFileSize: {
        color: '#888',
        fontSize: 12,
    },
    pdfPreviewNote: {
        backgroundColor: '#4F46E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    pdfPreviewNoteText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    pdfPreviewNoteSubtext: {
        color: '#ddd',
        fontSize: 14,
        textAlign: 'center',
    },
    pdfDataSection: {
        backgroundColor: '#111',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#222',
    },
    pdfDataTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    pdfDataText: {
        color: '#888',
        fontSize: 13,
        marginBottom: 6,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
    },
});

export default FilesScreen;
