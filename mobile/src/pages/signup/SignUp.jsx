import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import useSignup from '../../hooks/useSignup';

const SignUp = ({ navigation }) => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const { loading, signup } = useSignup();

    const handleSubmit = async () => {
        await signup(inputs);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create account</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name"
                            placeholderTextColor="#999"
                            value={inputs.fullName}
                            onChangeText={(text) => setInputs({ ...inputs, fullName: text })}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            placeholderTextColor="#999"
                            value={inputs.username}
                            onChangeText={(text) => setInputs({ ...inputs, username: text })}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor="#999"
                            value={inputs.password}
                            onChangeText={(text) => setInputs({ ...inputs, password: text })}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm password"
                            placeholderTextColor="#999"
                            value={inputs.confirmPassword}
                            onChangeText={(text) => setInputs({ ...inputs, confirmPassword: text })}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    inputs.gender === 'male' && styles.genderOptionSelected,
                                ]}
                                onPress={() => setInputs({ ...inputs, gender: 'male' })}
                            >
                                <Text
                                    style={[
                                        styles.genderText,
                                        inputs.gender === 'male' && styles.genderTextSelected,
                                    ]}
                                >
                                    Male
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.genderOption,
                                    inputs.gender === 'female' && styles.genderOptionSelected,
                                ]}
                                onPress={() => setInputs({ ...inputs, gender: 'female' })}
                            >
                                <Text
                                    style={[
                                        styles.genderText,
                                        inputs.gender === 'female' && styles.genderTextSelected,
                                    ]}
                                >
                                    Female
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>Already have an account?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 24,
        color: '#000',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderOption: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    genderOptionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    genderText: {
        fontSize: 16,
        color: '#333',
    },
    genderTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        marginTop: 16,
    },
    linkText: {
        fontSize: 14,
        color: '#007AFF',
        textAlign: 'center',
    },
});

export default SignUp;
