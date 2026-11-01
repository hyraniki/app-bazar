import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import * as Location from 'expo-location';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatBRL } from '../utils/format';

export default function HomeScreen({ navigation }) {
  const [locationText, setLocationText] = useState('Buscando localização...');
  const { items, addItem, total } = useCart();

  const pedirAcessoGPS = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationText('Localização não permitida');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocationText(`Lat: ${location.coords.latitude.toFixed(2)}, Lon: ${location.coords.longitude.toFixed(2)}`);
    } catch (error) {
      setLocationText('Erro ao buscar GPS');
    }
  };

  useEffect(() => {
    pedirAcessoGPS();
  }, []);

  const handleAddToCart = (item) => {
    addItem(item);
    // Recurso do celular: vibração ao adicionar ao carrinho
    Vibration.vibrate(80);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card} testID={`product-item-${item.id}`}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{formatBRL(item.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handleAddToCart(item)}
          testID={`add-button-${item.id}`}
        >
          <Text style={styles.buyButtonText}>ADICIONAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.location}>Envio para: {locationText}</Text>
        <TouchableOpacity style={styles.gpsButton} onPress={pedirAcessoGPS}>
          <Text style={styles.gpsButtonText}>📍 Atualizar GPS</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.cartButton, items.length === 0 && styles.disabled]}
        disabled={items.length === 0}
        onPress={() => navigation.navigate('Checkout')}
        testID="button-go-checkout"
      >
        <Text style={styles.cartButtonText}>
          Carrinho ({items.length}) · {formatBRL(total)}
        </Text>
      </TouchableOpacity>

      <FlatList
        testID="product-list"
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  location: { flex: 1, fontFamily: 'serif', fontSize: 12, color: '#666', textTransform: 'uppercase' },
  gpsButton: { backgroundColor: '#f5f5f5', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4 },
  gpsButtonText: { fontFamily: 'serif', fontSize: 10, color: '#000', fontWeight: 'bold' },
  cartButton: { backgroundColor: '#000', paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
  disabled: { backgroundColor: '#bbb' },
  cartButtonText: { fontFamily: 'serif', fontSize: 13, color: '#fff' },
  card: { marginBottom: 32 },
  image: { width: '100%', height: 400, resizeMode: 'cover', marginBottom: 12 },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textContainer: { flex: 1, paddingRight: 16 },
  name: { fontFamily: 'serif', fontSize: 16, color: '#000', marginBottom: 4 },
  price: { fontFamily: 'serif', fontSize: 16, fontWeight: 'bold', color: '#000' },
  buyButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 16 },
  buyButtonText: { color: '#fff', fontFamily: 'serif', fontSize: 12, fontWeight: 'bold' },
});