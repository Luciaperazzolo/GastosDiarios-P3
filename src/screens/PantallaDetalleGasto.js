import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';
import { useExpenses } from '../context/ExpensesContext';

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

// Muestra el detalle de un gasto: recibe solo el id y lo busca en el Context.
export default function PantallaDetalleGasto({ route, navigation }) {
  // route.params contiene lo que se envió en navigation.navigate(..., { gasto }).
    const { id } = route.params;
    const { expenses, removeExpense } = useExpenses();
    const gasto = expenses.find((item) => item.id === id);

    // Si el gasto no existe (por ejemplo, fue eliminado), se avisa.
    if (!gasto) {
      return (
        <View style={styles.contenedor}>
          <Encabezado titulo="Gasto no encontrado" />
        </View>
      );
    }

  // Pide confirmación antes de borrar; si la persona acepta, vuelve al listado.
  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar gasto',
      `¿Querés eliminar "${gasto.descripcion}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            removeExpense(gasto.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <Encabezado titulo={gasto.descripcion} />
      <Text style={styles.monto}>${gasto.monto.toLocaleString('es-AR')}</Text>
      <Text style={styles.fecha}>{formatearFecha(gasto.fecha)}</Text>
      <Text style={styles.notas}>{gasto.notas || 'Sin notas adicionales.'}</Text>
      <Pressable
        style={styles.botonEliminar}
        onPress={confirmarEliminacion}
        accessibilityRole="button"
      >
      <Text style={styles.textoEliminar}>Eliminar</Text>
      </Pressable>
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
  botonEliminar: {
    marginTop: 32,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
    backgroundColor: '#FFFFFF',
  },
  textoEliminar: { color: '#DC2626', fontSize: 17, fontWeight: 'bold' },
});