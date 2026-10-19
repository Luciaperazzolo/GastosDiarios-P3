import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Encabezado from '../components/Encabezado';

// El StackNavigator proporciona el objeto navigation directamente.
export default function FormularioNuevoGasto({ navigation, onGuardarGasto }) {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Comida');

  const guardarGasto = () => {
    if (!nombre.trim() || !monto.trim()) {
      Alert.alert('Campos incompletos', 'Ingresá el nombre y el monto del gasto.');
      return;
    }
    const montoNumerico = Number(monto.replace(',', '.'));
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      Alert.alert('Monto inválido', 'Ingresá un monto numérico mayor que cero.');
      return;
    }
    const nuevoGasto = {
      id: Date.now().toString(),
      descripcion: nombre.trim(),
      monto: montoNumerico,
      categoria: categoria,
    };
    onGuardarGasto(nuevoGasto);
    navigation.goBack();
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.contenedor}>
      <Encabezado titulo="Nuevo gasto" />

      <Text style={styles.etiqueta}>Nombre del gasto</Text>
      <TextInput
        style={styles.campo}
        placeholder="Ej.: Compra en supermercado"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Monto</Text>
      <TextInput
        style={styles.campo}
        placeholder="Ej.: 15000"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
      />

      <Text style={styles.etiqueta}>Categoría</Text>
      <View style={styles.categorias}>
        {['Comida', 'Transporte', 'Servicios', 'Otros'].map((opcion) => (
          <Pressable
            key={opcion}
            style={[
              styles.botonCategoria,
              categoria === opcion && styles.categoriaSeleccionada,
            ]}
            onPress={() => setCategoria(opcion)}
          >
            <Text
              style={[
                styles.textoCategoria,
                categoria === opcion && styles.textoCategoriaSeleccionada,
              ]}
            >
              {opcion}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.botonGuardar} onPress={guardarGasto} accessibilityRole="button">
        <Text style={styles.textoBoton}>Guardar</Text>
      </Pressable>

      <Pressable
        style={styles.botonVolver}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotonVolver}>Volver</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 24,
    justifyContent: 'center',
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  campo: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  botonCategoria: {
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  categoriaSeleccionada: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  textoCategoria: { color: '#374151', fontSize: 14 },
  textoCategoriaSeleccionada: { color: '#FFFFFF', fontWeight: '600' },
  botonGuardar: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  botonVolver: { marginTop: 12, padding: 14, alignItems: 'center' },
  textoBotonVolver: { color: '#2563EB', fontSize: 16, fontWeight: '600' },
});
