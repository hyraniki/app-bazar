import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Vibration } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCart } from '../context/CartContext';
import { saveOrder } from '../utils/storage';
import { formatBRL } from '../utils/format';

export default function CheckoutScreen({ navigation }) {
  const { items, removeItem, total, clearCart } = useCart();
  const [finishing, setFinishing] = useState(false);

  const renderItem = ({ item }) => (
    <View style={styles.row} testID={`cart-item-${item.id}`}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.qty}>Quantidade: {item.quantity}</Text>
      </View>
      <Text style={styles.price}>{formatBRL(item.price * item.quantity)}</Text>
      <TouchableOpacity onPress={() => removeItem(item.id)} testID={`remove-button-${item.id}`}>
        <Text style={styles.remove}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePurchase = async () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar.');
      return;
    }

    setFinishing(true);
    try {
      // Recurso do celular: GPS, para registrar o endereço de entrega do pedido
      let deliveryLocation = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        deliveryLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      const order = {
        id: Date.now().toString(),
        items,
        total,
        deliveryLocation,
        createdAt: new Date().toISOString(),
      };

      // Persistência: salva o pedido (criptografado com AES) no AsyncStorage
      await saveOrder(order);

      // Recurso do celular: vibração ao confirmar a compra
      Vibration.vibrate([0, 100, 50, 100]);

      // Recurso do celular: notificação de compra finalizada
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Compra Confirmada! 🛍️',
          body: `Seu pedido de ${formatBRL(total)} está sendo preparado.`,
        },
        trigger: null,
      }).catch((err) => console.log('Erro na notificação ignorado:', err));

      clearCart();
      navigation.navigate('Success', { total: order.total });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar a compra.');
    } finally {
      setFinishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Carrinho</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          testID="cart-list"
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>Total: {formatBRL(total)}</Text>
        <TouchableOpacity
          style={[styles.button, (items.length === 0 || finishing) && styles.disabled]}
          disabled={items.length === 0 || finishing}
          onPress={handlePurchase}
          testID="button-finish-order"
        >
          <Text style={styles.buttonText}>{finishing ? 'FINALIZANDO...' : 'FINALIZAR COMPRA'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 16 },
  title: { fontSize: 24, fontFamily: 'serif', paddingHorizontal: 16, marginBottom: 8 },
  empty: { textAlign: 'center', color: '#888', marginTop: 32, fontFamily: 'serif' },
  list: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 4, padding: 12, marginBottom: 10 },
  name: { fontFamily: 'serif', fontSize: 15, fontWeight: '600' },
  qty: { fontFamily: 'serif', fontSize: 12, color: '#888', marginTop: 2 },
  price: { fontFamily: 'serif', fontSize: 14, fontWeight: '600', marginHorizontal: 8 },
  remove: { fontFamily: 'serif', fontSize: 11, color: '#e74c3c' },
  footer: { borderTopWidth: 1, borderTopColor: '#eee', padding: 16 },
  total: { fontFamily: 'serif', fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'right' },
  button: { backgroundColor: '#000', paddingVertical: 16, alignItems: 'center' },
  disabled: { backgroundColor: '#bbb' },
  buttonText: { color: '#fff', fontFamily: 'serif', fontSize: 16, letterSpacing: 2 },
});
