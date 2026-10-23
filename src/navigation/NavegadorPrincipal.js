import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavegadorPestanas from './NavegadorPestanas';
import FormularioNuevoGasto from '../screens/FormularioNuevoGasto';
import PantallaDetalleGasto from '../screens/PantallaDetalleGasto';
import { useState } from 'react';
import { RUTAS } from './rutas';

const Stack = createNativeStackNavigator();

// Stack: abre formulario y detalle encima de las pestañas y permite regresar.
export default function NavegadorPrincipal() {
  const [gastos, setGastos] = useState([]);
  const guardarGasto = (nuevoGasto) => {
    setGastos((gastosActuales) => [...gastosActuales, nuevoGasto]);
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#2563EB',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: '#F3F4F6' },
      }}
    >
      <Stack.Screen
        name={RUTAS.PESTANAS}
        options={{ headerShown: false }}
      >
        {(props) => (
          <NavegadorPestanas
            {...props}
            gastos={gastos}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={RUTAS.FORMULARIO}
        options={{ title: 'Nuevo gasto', presentation: 'modal' }}
        >
        {(props) => (
          <FormularioNuevoGasto
          {...props}
          onGuardarGasto={guardarGasto}
        />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={RUTAS.DETALLE_GASTO}
        component={PantallaDetalleGasto}
        options={{ title: 'Detalle del gasto' }}
      />
    </Stack.Navigator>
  );
}