import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatBRL } from '../utils/format';

export default function SuccessScreen({ navigation, route }) {
  const total = route?.params?.total ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✔️</Text>
      <Text style={styles.title}>Compra Finalizada!</Text>
      <Text style={styles.message}>
        Seu pedido de {formatBRL(total)} foi processado com sucesso e já está sendo preparado para envio.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.popToTop()} testID="button-back-home">
        <Text style={styles.buttonText}>VOLTAR AO INÍCIO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { fontSize: 64, marginBottom: 24 },
  title: { fontFamily: 'serif', fontSize: 28, color: '#000', marginBottom: 16, textAlign: 'center' },
  message: { fontFamily: 'serif', fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 48 },
  button: { backgroundColor: '#000', paddingVertical: 16, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontFamily: 'serif', fontSize: 16, letterSpacing: 2 },
});
