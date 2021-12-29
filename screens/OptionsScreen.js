import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  View,
  Alert,
  Pressable,
  Modal,
  useColorScheme,
} from 'react-native';
import {
  auth,
  db,
  usersRef,
  collection,
  doc,
  setDoc,
  getDoc,
} from '../firebase';
import { signOut } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import CurrencyPicker from '../components/CurrencyPicker';
import { Store } from '../context/Store';

const OptionsScreen = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [darkMode, setDarkMode] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const { state, dispatch } = useContext(Store);
  const colorScheme = useColorScheme();
  const [nativeCurrency, setNativeCurrency] = useState(state.domesticCurrency);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (colorScheme === 'dark') {
        dispatch({ type: 'SET_DARK_MODE', payload: true });
      } else {
        dispatch({ type: 'SET_DARK_MODE', payload: false });
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const handleSignout = () => {
    signOut(auth)
      .then((v) => {
        setCurrentUser(null);
        dispatch({ type: 'LOGOUT' });
        navigation.navigate('Login');
      })
      .catch((error) => console.log(error.message));
  };
  const handleReset = () => {
    Alert.alert(
      'This will delete all transactions and reset your account balance.',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancelled'),
        },
        {
          text: 'Confirm',
          onPress: () => console.log('Account Reset'),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('Dismissed'),
      }
    );
  };

  const handleAccountDelete = () => {
    Alert.alert(
      'This will permanently delete your account and all associated information.',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: delete account from firestore
            console.log('Deleted');
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('Dismissed'),
      }
    );
  };

  const handleCurrencyModalBtn = () => {
    setModalOpen(!modalOpen);
  };

  const handleCurrencySelect = () => {
    dispatch({ type: 'SET_DOMESTIC_CURRENCY', payload: nativeCurrency });
    setModalOpen(!modalOpen);
  };

  const user = auth.currentUser;
  return (
    <KeyboardAvoidingView
      style={state.darkMode ? styles.darkContainer : styles.lightContainer}
      behavior="padding"
    >
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalOpen}
          onRequestClose={() => {
            setModalOpen(!modalOpen);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Your Native Currency:</Text>
              <Picker
                style={styles.currencyPicker}
                selectedValue={nativeCurrency}
                onValueChange={(itemValue, itemIndex) => {
                  setNativeCurrency(itemValue);
                }}
              >
                <Picker.Item
                  style={styles.pickerItem}
                  label="CHF"
                  value="CHF"
                />
                <Picker.Item
                  style={styles.pickerItem}
                  label="AUD"
                  value="AUD"
                />
                <Picker.Item
                  style={styles.pickerItem}
                  label="USD"
                  value="USD"
                />
                <Picker.Item
                  style={styles.pickerItem}
                  label="EUR"
                  value="EUR"
                />
              </Picker>
              <TouchableOpacity
                style={styles.buttonOutline}
                onPress={handleCurrencySelect}
              >
                <Text style={styles.buttonOutlineText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingLeft: '10%',
        }}
      >
        <Text
          style={[
            styles.userEmail,
            { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
          ]}
        >
          {user.email}
        </Text>
        <Text
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            marginBottom: 24,
            color: state.darkMode ? '#fefefe' : '#0e0e0e',
          }}
        >
          Test
        </Text>
        <Text
          style={[
            styles.sectionTitle,
            { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
          ]}
        >
          Account
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCurrencyModalBtn}
          >
            <Text
              style={[
                styles.buttonText,
                { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
              ]}
            >
              Native Currency
            </Text>
            <Text
              style={[
                styles.buttonText,
                { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
              ]}
            >
              {state.domesticCurrency}
            </Text>
          </TouchableOpacity>
          <View style={styles.button} onPress={handleCurrencyModalBtn}>
            <Text
              style={[
                styles.buttonText,
                { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
              ]}
            >
              Balance
            </Text>
            <Text
              style={[
                styles.buttonText,
                { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
              ]}
            >
              {state.principal}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text
              style={[
                styles.buttonText,
                { color: state.darkMode ? '#fefefe' : '#0e0e0e' },
              ]}
            >
              Reset Balances
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              color={state.darkMode ? 'white' : 'black'}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.buttonContainer,
            {
              marginTop: 48,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.buttonOutline,
              {
                backgroundColor: state.darkMode ? '#3e3e3e' : '#fefefe',
              },
            ]}
            onPress={handleSignout}
          >
            <Text
              style={[
                styles.buttonOutlineText,
                styles.dangerText,
                {
                  backgroundColor: state.darkMode ? '#3e3e3e' : '#fefefe',
                },
              ]}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonOutline,
              {
                backgroundColor: state.darkMode ? '#3e3e3e' : '#fefefe',
              },
            ]}
            onPress={handleAccountDelete}
          >
            <Text style={[styles.buttonOutlineText, styles.dangerText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OptionsScreen;

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingTop: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#21262d',
    paddingTop: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputContainer: {
    width: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 24,
    width: '100%',
    marginBottom: 36,
    borderColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '300',
  },
  currencyPicker: {
    width: '100%',
  },
  pickerItem: {
    margin: 0,
    padding: 0,
  },
  buttonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#A9ABB1',
    marginTop: 16,
  },
  button: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
  },
  buttonOutline: {
    marginVertical: 8,
    width: '90%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonOutlineText: {
    fontSize: 16,
  },
  dangerText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '60%',
    height: 368,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
    // backgroundColor: 'black',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
