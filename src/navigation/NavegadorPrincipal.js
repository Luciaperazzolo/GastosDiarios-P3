import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavegadorPestanas from './NavegadorPestanas';
import FormularioNuevoGasto from '../screens/FormularioNuevoGasto';
import PantallaDetalleGasto from '../screens/PantallaDetalleGasto';
import { RUTAS } from './rutas';

const Stack = createNativeStackNavigator();

// Stack: abre formulario y detalle encima de las pestañas y permite regresar.
export default function NavegadorPrincipal() {
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
        component={NavegadorPestanas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={RUTAS.FORMULARIO}
        component={FormularioNuevoGasto}
        options={{ title: 'Nuevo gasto', presentation: 'modal' }}
      />
      <Stack.Screen
        name={RUTAS.DETALLE_GASTO}
        component={PantallaDetalleGasto}
        options={{ title: 'Detalle del gasto' }}
      />
    </Stack.Navigator>
  );
}