import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { isEmpty } from '../services/inputValidation';
import { Store } from '../context/Store';
import { loginUser } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const handleSignIn = async () => {
    // Validate user input
    if (isEmpty(email)) {
      alert('Email is required');
      return;
    }
    if (isEmpty(password)) {
      alert('Password is required');
      return;
    }
    try {
      // Submit login information to firebase
      const userInfo = await loginUser(email, password);
      // Save user info to application state
      dispatch({
        type: 'LOGIN',
        payload: userInfo,
      });
      // Save user info to local storage
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {}, []);
  return (
    <KeyboardAvoidingView
      style={darkMode ? styles.darkContainer : styles.lightContainer}
      behavior="padding"
    >
      <Text
        style={{
          color: darkMode ? '#dedede' : '#1a1a1a',
          fontSize: 24,
          marginBottom: 48,
        }}
      >
        Crypto Market Sim
      </Text>
      <View style={styles.inputContainer}>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e' }}>Email</Text>
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
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={handleSignIn}
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    // backgroundColor: '#0782F9',
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
    // color: '#0782F9',
    color: '#343a40',
    fontWeight: '700',
    fontSize: 16,
  },
});
