import { Pressable, StyleSheet, Text } from 'react-native';

// Botón reutilizable con tres variantes: primario, secundario y enlace.
export default function Boton({ titulo, onPress, variante = 'primario', estilo }) {
  return (
    <Pressable
      style={[styles.base, styles[variante], estilo]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={[styles.textoBase, styles[variante + 'Texto']]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  textoBase: { fontSize: 16 },

  primario: { backgroundColor: '#2563EB' },
  primarioTexto: { color: '#FFFFFF', fontWeight: 'bold' },

  secundario: {
    borderWidth: 1,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  secundarioTexto: { color: '#2563EB', fontWeight: 'bold' },

  enlace: {},
  enlaceTexto: { color: '#2563EB', fontWeight: '600' },
});