import React, { createContext, useEffect, useReducer } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

const initialState = { darkMode: false };

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'LIGHTMODE':
      return { darkMode: false };
    case 'DARKMODE':
      return { darkMode: true };
    default:
      return state;
  }
};

export function ThemeProvider(props) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  //   useEffect(() => {
  //     const colorScheme = useColorScheme();
  //     if (colorScheme === 'dark') {
  //       // dispatch({ type: 'DARKMODE' });
  //     } else {
  //       // dispatch({ type: 'LIGHTMODE' });
  //     }
  //   }, []);

  return (
    <ThemeContext.Provider value={{ state: state, dispatch: dispatch }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export const themes = {
  dark: { color: '#dedede', backgroundColor: '#0e0e0e' },
  light: { color: '#0e0e0e', backgroundColor: '#dedede' },
};
