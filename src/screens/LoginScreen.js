import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Vibration, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { validateLogin, saveSession } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // Verifica usuário + senha contra a "tabela" de usuários no AsyncStorage
      const valid = await validateLogin(username, password);

      if (!valid) {
        Alert.alert('Erro', 'Usuário ou senha incorretos.');
        return;
      }

      // Persistência: guarda qual usuário está logado agora
      await saveSession(username.trim().toLowerCase());

      // Feedback tátil
      Vibration.vibrate(200);

      // Notificação de boas-vindas
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Bem-vindo(a)!', body: `Login realizado com sucesso, ${username}.` },
          trigger: null,
        });
      }

      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao realizar o login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bazar da Shirley</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        testID="input-username"
      />

      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          testID="input-password"
        />
        {/* Toggle simples de estado (mesmo princípio do exemplo "Navegação") */}
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} testID="toggle-password">
          <Text style={styles.toggleText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} testID="login-button" disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'ENTRANDO...' : 'ENTRAR'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Register')}
        testID="go-register"
      >
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 32, fontFamily: 'serif', textAlign: 'center', marginBottom: 48, letterSpacing: 1 },
  input: { borderBottomWidth: 1, borderColor: '#000', marginBottom: 24, paddingVertical: 8, fontFamily: 'serif', fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#000', marginBottom: 24 },
  passwordInput: { flex: 1, paddingVertical: 8, fontFamily: 'serif', fontSize: 16 },
  toggleText: { fontFamily: 'serif', fontSize: 12, color: '#666', marginLeft: 8 },
  button: { backgroundColor: '#000', padding: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontFamily: 'serif', fontSize: 16, letterSpacing: 2 },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { fontFamily: 'serif', fontSize: 14, color: '#000', textDecorationLine: 'underline' },
});
