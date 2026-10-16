import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import FormularioNuevoGasto from './src/screens/FormularioNuevoGasto';

export default function App() {
  // Controla qué pantalla se muestraS
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Si el usuario quiere cargar un gasto, mostramos el formulario
  if (mostrarFormulario) {
    return (
      <FormularioNuevoGasto onVolver={() => setMostrarFormulario(false)}/>
    );
  }

  return (
    <View style={styles.container}> 
      <StatusBar style="dark" /> 
      <View style={styles.card}> 
        <Text style={styles.title}>ExpenseTracker</Text>
        <Text style={styles.welcome}>¡Bienvenido/a!</Text>
        <Text style={styles.description}>Una forma sencilla de registrar y organizar tus gastos diarios.</Text>

        <Pressable style={styles.boton} onPress={() => setMostrarFormulario(true)}>
          <Text style={styles.textoBoton}>Nuevo gasto</Text>
        </Pressable>
      </View>
    </View>
  );
}

//StyleSheet: nos permite definir los estilos en un objeto organizado.
const styles = StyleSheet.create({
  //Estilos del contenedor general (fondo gris claro, centrado y con espacio interior)
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  //Estilos de la tarjeta central (fondo blanco, bordes redondeados y sombra)
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 28, //Espacio interior de la tarjeta
    borderRadius: 16,
    alignItems: 'center', //Centrado horizontal de los elementos dentro de la tarjeta
    elevation: 4, //Sombra para Android
  },

  //Estilos del título (texto grande, en negrita y de color azul)
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 24,
    textAlign: 'center',
  },

  //Estilos del texto de bienvenida (tamaño mediano y color oscuro)
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },

  //Estilos de la descripción (texto gris legible con separación entre líneas)
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
  },

  //Estilos del botón (fondo azul, bordes redondeados y centrado del texto)
  boton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },

  //Estilos del texto del botón (blanco, tamaño mediano y en negrita)
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
