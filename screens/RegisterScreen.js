import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { isEmpty, isMatch } from '../services/inputValidation';
import { Store } from '../context/Store';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  const navigation = useNavigation();

  const handleSignUp = () => {
    // Validate Inputs
    if (isEmpty(username)) {
      alert('Username is required');
      return;
    }
    if (isEmpty(email)) {
      alert('Email is required');
      return;
    }
    if (!isEmail(email)) {
      alert('Email is not valid');
      return;
    }
    if (isEmpty(password)) {
      alert('Password is required');
      return;
    }
    if (!isMatch(password, confirmPassword)) {
      alert('Passwords do not match');
      return;
    }
    // Create new user
    dispatch({
      type: 'REGISTER',
      payload: { username: username, email: email, password: password },
    });
  };

  return (
    <KeyboardAvoidingView
      style={darkMode ? styles.darkContainer : styles.lightContainer}
      behavior="padding"
    >
      <Text
        style={{
          color: darkMode ? '#dedede' : '#3e3e3e',
          fontSize: 24,
          marginBottom: 48,
        }}
      >
        Crypto Market Sim
      </Text>
      <View style={styles.inputContainer}>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e' }}>
          Username
        </Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={username}
          onChangeText={(text) => setUsername(text)}
        ></TextInput>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e', marginTop: 6 }}>
          Email
        </Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e', marginTop: 6 }}>
          Password
        </Text>
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e', marginTop: 6 }}>
          Confirm Password
        </Text>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignUp}
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21262d',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#343a40',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 8,
    borderColor: '#343a40',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#343a40',
    fontWeight: '700',
    fontSize: 16,
  },
});
