import { StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';

// Muestra el gasto que recibe por parámetros desde el listado.
export default function PantallaDetalleGasto({ route }) {
  // route.params contiene lo que se envió en navigation.navigate(..., { gasto }).
  const { gasto } = route.params;

  return (
    <View style={styles.contenedor}>
      <Encabezado titulo={gasto.descripcion} />
      <Text style={styles.monto}>${gasto.monto.toLocaleString('es-AR')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  monto: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', textAlign: 'center' },
});