import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavegadorPestanas from './NavegadorPestanas';
import FormularioNuevoGasto from '../screens/FormularioNuevoGasto';

const Stack = createNativeStackNavigator();

// Stack: abre el formulario encima de las pestañas y permite regresar.
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
        name="Pestanas"
        component={NavegadorPestanas}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Formulario"
        component={FormularioNuevoGasto}
        options={{ title: 'Nuevo gasto' }}
      />
    </Stack.Navigator>
  );
}
