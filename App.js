import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import { CartProvider } from './src/context/CartContext';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      await Notifications.requestPermissionsAsync();
    };
    requestPermissions();
  }, []);

  return (
    // CartProvider precisa envolver todo o Navigator, senão as telas que usam
    // useCart() (Home e Checkout) quebram em tempo de execução.
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { fontFamily: 'serif', fontWeight: 'bold' },
            headerTintColor: '#000',
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Bazar da Shirley' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar' }} />
          <Stack.Screen name="Success" component={SuccessScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}