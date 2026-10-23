import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';

// Pantalla de ajustes de la app (por ahora solo muestra el encabezado).
export default function PantallaConfiguracion() {
  return (
    <SafeAreaView edges={['top']} style={styles.contenedor}>
      <Encabezado
        titulo="Configuración"
        descripcion="Próximamente vas a poder ajustar la app acá."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F3F4F6', padding: 24 },
});