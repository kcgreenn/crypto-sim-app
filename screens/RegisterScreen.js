import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { isEmail, isEmpty, isMatch } from '../services/inputValidation';
import { Store } from '../context/Store';
import { auth, registerUser } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;
  const navigation = useNavigation();

  const handleSignUp = async () => {
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
    try {
      // Submit login information to firebase
      console.log('before register user');
      const userInfo = await registerUser(username, email, password);
      console.log(userInfo);
      console.log('after register user');
      userInfo.darkMode = darkMode;
      // Save user info to local storage and Store
      dispatch({
        type: 'SET_USER',
        payload: {
          name: userInfo.name,
          email: email,
          uid: userInfo.uid,
          principal: userInfo.principal,
          domesticCurrency: userInfo.domesticCurrency,
          assets: userInfo.assets,
          transactions: userInfo.transactions,
        },
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.log(error);
    }
    // Create new user
    dispatch({
      type: 'REGISTER',
      payload: { username: username, email: email, uid: userInfo.uid },
    });
  };
  useEffect(() => {}, []);

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
          returnKeyType="done"
          onChangeText={(text) => setUsername(text)}
        ></TextInput>
        <Text style={{ color: darkMode ? '#dedede' : '#3e3e3e', marginTop: 6 }}>
          Email
        </Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          returnKeyType="done"
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
          returnKeyType="done"
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
          returnKeyType="done"
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
