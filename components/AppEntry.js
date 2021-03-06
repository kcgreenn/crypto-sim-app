import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OptionsScreen from '../screens/OptionsScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebase';
import RegisterScreen from '../screens/RegisterScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import { Store, StoreProvider } from '../context/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tabs = createMaterialBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function AppEntry() {
  const [initializing, setInitializing] = useState(true);
  const { state, dispatch } = useContext(Store);
  const [user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(async () => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    const getUser = async () => {
      try {
        if (state.uid === '') {
          const userInfo = await AsyncStorage.getItem('userInfo');
          if (userInfo) {
            dispatch({ type: 'SET_USER', payload: JSON.parse(userInfo) });
          }
        }
      } catch {
        (error) => {
          console.log(error);
        };
      }
    };
    await getUser();
    return subscriber; // Unsubscribe on component unmount
  }, [state]);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Tabs.Navigator barStyle={{ backgroundColor: '#343a40' }}>
          <Tabs.Screen
            name="Login"
            component={LoginScreen}
            options={{
              tabBarLabel: 'Login',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="login" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              tabBarLabel: 'Register',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-plus"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        </Tabs.Navigator>
      </NavigationContainer>
    );
  }
  if (user) {
    return (
      <NavigationContainer>
        <Tabs.Navigator barStyle={{ backgroundColor: '#343a40' }}>
          <Tabs.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tabs.Screen
            name="Portfolio"
            component={PortfolioScreen}
            options={{
              tabBarLabel: 'Portfolio',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="chart-bar"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Transactions"
            component={TransactionsScreen}
            options={{
              tabBarLabel: 'Transactions',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="history"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="Options"
            component={OptionsScreen}
            options={{
              tabBarLabel: 'Options',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="cog" color={color} size={26} />
              ),
            }}
          />
        </Tabs.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
