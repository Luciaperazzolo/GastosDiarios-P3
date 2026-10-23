import { StyleSheet, Text, View } from 'react-native';

// Componente reutilizable para títulos y descripciones de las pantallas.
export default function Encabezado({ titulo, descripcion }) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      {descripcion ? (
        <Text style={styles.descripcion}>{descripcion}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { alignItems: 'center', marginBottom: 24 },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },
});
