import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';
import Boton from '../components/Boton';
import { RUTAS } from '../navigation/rutas';

// Pantalla de bienvenida: ahora es una pantalla real del TabNavigator.
export default function PantallaInicio({ navigation }) {
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

  iconoApp: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
});