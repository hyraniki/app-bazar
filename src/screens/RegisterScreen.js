import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { registerUser } from '../utils/storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      // Cadastra o par usuário/senha — a senha é salva com hash SHA-256, nunca em texto puro
      const result = await registerUser(username, password);

      if (!result.success) {
        Alert.alert('Erro', result.message);
        return;
      }

      Alert.alert('Sucesso', result.message, [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        testID="input-username"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        testID="input-password"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        testID="input-confirm-password"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} testID="register-button" disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'CADASTRANDO...' : 'CADASTRAR'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()} testID="go-login">
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  title: { fontSize: 32, fontFamily: 'serif', textAlign: 'center', marginBottom: 48, letterSpacing: 1 },
  input: { borderBottomWidth: 1, borderColor: '#000', marginBottom: 24, paddingVertical: 8, fontFamily: 'serif', fontSize: 16 },
  button: { backgroundColor: '#000', padding: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontFamily: 'serif', fontSize: 16, letterSpacing: 2 },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { fontFamily: 'serif', fontSize: 14, color: '#000', textDecorationLine: 'underline' },
});
