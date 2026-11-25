import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import Boton from '../components/Boton';
import { RUTAS } from '../navigation/rutas';
import { useExpenses } from '../context/ExpensesContext';

// Pantalla de bienvenida: ahora es una pantalla real del TabNavigator.
export default function PantallaInicio({ navigation }) {
  const { expenses } = useExpenses();
  const totalGastos = expenses.reduce((total, gasto) => total + gasto.monto, 0);
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.iconoApp}
          resizeMode="contain"
          accessibilityLabel="Ícono de ExpenseTracker"
          
        />
      <Text style={styles.title}>ExpenseTracker</Text>
        <Encabezado
          titulo="¡Bienvenido/a!"
          descripcion="Una forma sencilla de registrar y organizar tus gastos diarios."
        />

        {/* Esta acción cambia a la pestaña Gastos. */}
        <Boton
          titulo="Ver gastos"
          variante="secundario"
          estilo={styles.separacion}
          onPress={() => navigation.navigate(RUTAS.GASTOS)}
        />
      </View>

            <View style={[styles.card, styles.tarjetaResumen]}>
        <Text style={styles.tituloResumen}>Resumen de gastos</Text>

        {expenses.length === 0 ? (
          <Text style={styles.textoVacio}>Todavía no registraste gastos</Text>
        ) : (
          <View style={styles.filaResumen}>
            <View style={styles.dato}>
              <Text style={styles.etiquetaDato}>Total registrado</Text>
              <Text style={styles.valorDato}>
                ${totalGastos.toLocaleString('es-AR')}
              </Text>
            </View>
            <View style={styles.dato}>
              <Text style={styles.etiquetaDato}>Movimientos</Text>
              <Text style={styles.valorDato}>{expenses.length}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 24,
    textAlign: 'center',
  },
  separacion: { marginTop: 12 },
    tarjetaResumen: { marginTop: 16 },
  tituloResumen: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  filaResumen: { flexDirection: 'row', gap: 12, width: '100%' },
  dato: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  etiquetaDato: { fontSize: 13, color: '#4B5563', textAlign: 'center' },
  valorDato: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
  textoVacio: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  iconoApp: { width: 80, height: 80, marginBottom: 16,
  },
});