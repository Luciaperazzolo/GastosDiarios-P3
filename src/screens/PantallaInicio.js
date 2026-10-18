import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import { RUTAS } from '../navigation/rutas';

// Pantalla de bienvenida: ahora es una pantalla real del TabNavigator.
export default function PantallaInicio({ navigation }) {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Encabezado
          titulo="¡Bienvenido/a!"
          descripcion="Una forma sencilla de registrar y organizar tus gastos diarios."
        />

        {/* La acción se envía al StackNavigator que contiene las pestañas. */}
        <Pressable
          style={styles.boton}
          onPress={() => navigation.navigate(RUTAS.FORMULARIO)}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Nuevo gasto</Text>
        </Pressable>

        {/* Esta acción cambia a la pestaña Gastos. */}
        <Pressable
          style={styles.botonSecundario}
          onPress={() => navigation.navigate(RUTAS.GASTOS)}
          accessibilityRole="button"
        >
          <Text style={styles.textoBotonSecundario}>Ver gastos</Text>
        </Pressable>
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
  boton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  textoBoton: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  botonSecundario: {
    borderWidth: 1,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  textoBotonSecundario: { color: '#2563EB', fontSize: 16, fontWeight: 'bold' },
});
