import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import { RUTAS } from '../navigation/rutas';
import { useExpenses } from '../context/ExpensesContext';
import { getCategory } from '../data/categories';

// User Story #6: esta pantalla se muestra a través del TabNavigator.
export default function PantallaGastos({ navigation }) {
  const { expenses } = useExpenses();
  const totalGastos = expenses.reduce((total, gasto) => total + gasto.monto, 0);
  return (
    <SafeAreaView edges={['top']} style={styles.contenedor}>
      <Encabezado
        titulo="Listado de gastos"
        descripcion="Así se verán tus gastos cuando los registres."
      />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.estadoVacio}>
            <Ionicons name="wallet-outline" size={48} color="#9CA3AF" />
            <Text style={styles.tituloVacio}>Todavía no registraste gastos</Text>
            <Text style={styles.textoVacio}>
              Tocá el botón + para agregar el primero.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
        const estiloCategoria = getCategory(item.categoria);

    return (
    <Pressable
      style={styles.tarjetaGasto}
      onPress={() => navigation.navigate(RUTAS.DETALLE_GASTO, { id: item.id })}
    >
      <View style={styles.infoGasto}>
        <View
          style={[
            styles.iconoCategoria,
            { backgroundColor: estiloCategoria.color },
          ]}
        >
          <Ionicons
            name={estiloCategoria.icono}
            size={22}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.detalleGasto}>
          <Text style={styles.nombreGasto}>{item.descripcion}</Text>
          <Text style={styles.categoriaGasto}>{item.categoria || 'Otros'}</Text>
        </View>
      </View>

      <Text style={[styles.montoGasto, { color: estiloCategoria.color }]}>
        ${item.monto.toLocaleString('es-AR')}
      </Text>
    </Pressable>
    );
    }}
      />

      <View style={styles.tarjetaTotal}>
        <Text style={styles.textoTotal}>Total de gastos</Text>
          <Text style={styles.montoTotal}>
          ${totalGastos.toLocaleString('es-AR')}
        </Text>
      </View>

      <Pressable
        style={styles.botonVolver}
        onPress={() => navigation.navigate(RUTAS.INICIO)}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotonVolver}>Volver al inicio</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  lista: { paddingBottom: 16 },
  estadoVacio: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  tituloVacio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  textoVacio: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
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
  montoGasto: { fontSize: 16, color: '#2563EB', fontWeight: 'bold' },
  botonVolver: { padding: 14, alignItems: 'center' },
  textoBotonVolver: { color: '#2563EB', fontSize: 16, fontWeight: '600' },

  infoGasto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
      flex: 1,
  },
  iconoCategoria: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalleGasto: {
    flex: 1,
    gap: 4,
  },
  categoriaGasto: {
    fontSize: 13,
    color: '#6B7280',
  },
  tarjetaTotal: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  textoTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  montoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});
