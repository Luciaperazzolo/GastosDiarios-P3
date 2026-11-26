import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';

// Aviso flotante que aparece solo cuando el dispositivo no tiene conexión.
export default function AvisoSinConexion() {
  const { isConnected, isInternetReachable } = useNetInfo();
  const insets = useSafeAreaInsets();

  // Ambos valores son null mientras se averigua el estado inicial.
  const sinConexion = isConnected === false || isInternetReachable === false;
  if (!sinConexion) return null;

  return (
    <View
      pointerEvents="none"
      style={[styles.contenedor, { top: insets.top + 8 }]}
      accessibilityRole="alert"
    >
      <View style={styles.aviso}>
        <Text style={styles.texto}>Sin conexión</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  aviso: {
    backgroundColor: '#DC2626',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  texto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});