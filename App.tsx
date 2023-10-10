/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState, createContext, useReducer, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SignInComponent } from './src/components/SignInComponent';
import { HomeComponent } from './src/components/HomeComponent'
import SplashScreen from './src/components/SplashScreen';
import { RootStackParamsList, User } from './src/types/types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';



/* type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
} */
export const AuthContext = createContext({})
const Stack = createNativeStackNavigator<RootStackParamsList>()

function App(): JSX.Element {

  const [userToken, setUserToken] = useState(null)
  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false
        }
      case 'SIGN_IN':
        console.log('Inside sign in case\nData is: ', action, '\PrevState is: ', prevState)
        setUserToken(action.token)
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token
        }
      case 'SIGN_OUT':
        console.log('Sign out case\nData is: ', action, '\PrevState is: ', prevState)
        setUserToken(null)
        return {
          ...prevState,
          isSignout: true,
          userToken: null
        }
    }
  },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  )

  const getUserToken = async () => {
    // testing purposes
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    try {
      // custom logic
      await sleep(2000);
      const token = null;
      setUserToken(token);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken
      try {

      } catch (error) {
        console.log('Getting user token failed: ', error)
      }

      // validate token

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }
    bootstrapAsync()
    console.log("User Token: ", userToken)
  }, [])

  const authContext = useMemo(() => ({
    signIn: async (data: FirebaseAuthTypes.UserCredential) => {
      console.log('sign in data: ', data)
      dispatch({ type: 'SIGN_IN', token: data.user.uid })
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' })
  }), [])

  if (state.isLoading) {
    return <SplashScreen />
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {userToken == null ? (
            <Stack.Screen name='SignIn' component={SignInComponent} options={{ title: 'Sign in', animationTypeForReplace: state.isSignout ? 'pop' : 'push', }} />
          ) : (
            <Stack.Screen name='Home' component={HomeComponent} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
