import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// User Story #5: registros de ejemplo definidos manualmente.
// Más adelante esta lista se podrá reemplazar por gastos guardados.
const gastosDeEjemplo = [
  { id: '1', descripcion: 'Supermercado', monto: 25000 },
  { id: '2', descripcion: 'Combustible', monto: 18000 },
  { id: '3', descripcion: 'Internet', monto: 32000 },
];

export default function PantallaGastos({ onVolver }) {
  return (
    <View style={styles.contenedor}>
      <StatusBar style="dark" />
      <Text style={styles.titulo}>Listado de gastos</Text>
      <Text style={styles.descripcion}>
        Así se verán los gastos cuando los registremos.
      </Text>

      <FlatList
        data={gastosDeEjemplo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.tarjetaGasto}>
            <Text style={styles.nombreGasto}>{item.descripcion}</Text>
            <Text style={styles.montoGasto}>
              ${item.monto.toLocaleString('es-AR')}
            </Text>
          </View>
        )}
      />

      <Pressable style={styles.botonVolver} onPress={onVolver}>
        <Text style={styles.textoBotonVolver}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
    paddingTop: 60,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  lista: {
    paddingBottom: 16,
  },
  tarjetaGasto: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  nombreGasto: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    flexShrink: 1,
  },
  montoGasto: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  botonVolver: {
    padding: 14,
    alignItems: 'center',
  },
  textoBotonVolver: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});
