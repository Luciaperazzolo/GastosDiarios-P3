import { StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';

// Convierte la fecha ISO del gasto a un texto legible en español.
function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime())
    ? fecha
    : valor.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
}

// Muestra el gasto que recibe por parámetros desde el listado.
export default function PantallaDetalleGasto({ route }) {
  // route.params contiene lo que se envió en navigation.navigate(..., { gasto }).
  const { gasto } = route.params;

  return (
    <View style={styles.contenedor}>
      <Encabezado titulo={gasto.descripcion} />
      <Text style={styles.monto}>${gasto.monto.toLocaleString('es-AR')}</Text>
      <Text style={styles.fecha}>{formatearFecha(gasto.fecha)}</Text>
      <Text style={styles.notas}>{gasto.notas || 'Sin notas adicionales.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
  monto: { fontSize: 32, fontWeight: 'bold', color: '#2563EB', textAlign: 'center' },
  fecha: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 12 },
  notas: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
  },
});