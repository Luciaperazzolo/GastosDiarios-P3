import { StyleSheet, Switch, Text, View,} from 'react-native';

import { SafeAreaView,} from 'react-native-safe-area-context';

import Encabezado from '../components/Encabezado';
import { useExpenses } from '../context/ExpensesContext';

export default function PantallaConfiguracion() {
  // La pantalla consulta y modifica los ajustes mediante el Context.
  // El Provider se encarga de guardarlos.
  const {
    settings,
    updateSettings,
  } = useExpenses();

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.contenedor}
    >
      <Encabezado
        titulo="Configuración"
        descripcion="Tus preferencias se guardan automáticamente."
      />

      <View style={styles.tarjeta}>
        <View style={styles.fila}>
          <Text style={styles.etiqueta}>
            Notificaciones
          </Text>

          <Switch
            value={settings.notificaciones}
            onValueChange={(valor) =>
              updateSettings({
                notificaciones: valor,
              })
            }
            trackColor={{
              false: '#D1D5DB',
              true: '#93C5FD',
            }}
            thumbColor={
              settings.notificaciones
                ? '#2563EB'
                : '#F9FAFB'
            }
            accessibilityLabel="Preferencia de notificaciones"
          />
        </View>

        <View
          style={[
            styles.fila,
            styles.ultimaFila,
          ]}
        >
          <Text style={styles.etiqueta}>
            Modo oscuro
          </Text>

          <Switch
            value={settings.modoOscuro}
            onValueChange={(valor) =>
              updateSettings({
                modoOscuro: valor,
              })
            }
            trackColor={{
              false: '#D1D5DB',
              true: '#93C5FD',
            }}
            thumbColor={
              settings.modoOscuro
                ? '#2563EB'
                : '#F9FAFB'
            }
            accessibilityLabel="Preferencia de modo oscuro"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    borderRadius: 12,
    elevation: 2,
  },

  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  ultimaFila: {
    borderBottomWidth: 0,
  },

  etiqueta: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});