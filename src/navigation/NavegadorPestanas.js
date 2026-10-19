import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import PantallaInicio from '../screens/PantallaInicio';
import PantallaGastos from '../screens/PantallaGastos';
import PantallaConfiguracion from '../screens/PantallaConfiguracion';
import { RUTAS } from './rutas';

const Tab = createBottomTabNavigator();
function PantallaBotonAgregar() {
  return null;
}

// Íconos de cada pestaña: el primero es el activo y el segundo el inactivo.
const ICONOS = {
  [RUTAS.INICIO]: ['home', 'home-outline'],
  [RUTAS.GASTOS]: ['list', 'list-outline'],
  [RUTAS.CONFIGURACION]: ['settings', 'settings-outline'],
};

// Tab: la barra inferior permite cambiar entre Inicio, Gastos y Configuración.
export default function NavegadorPestanas({ gastos }) {
  return (
    <Tab.Navigator
      initialRouteName={RUTAS.INICIO}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB' },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const [activo, inactivo] = ICONOS[route.name];
          return <Ionicons name={focused ? activo : inactivo} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={RUTAS.INICIO}
        component={PantallaInicio}
      />

      <Tab.Screen
        name="Agregar"
        component={PantallaBotonAgregar}
        options={({ navigation }) => ({
          tabBarLabel: '',
          tabBarButton: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nuevo gasto"
            onPress={() =>
            navigation.getParent()?.navigate(RUTAS.FORMULARIO)
          }
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
          <Ionicons name="add-circle" size={40} color="#2563EB" />
        </Pressable>
        ),
        })}
      />

      <Tab.Screen name={RUTAS.GASTOS}>
        {(props) => (
          <PantallaGastos
            {...props}
            gastos={gastos}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={RUTAS.CONFIGURACION}
        component={PantallaConfiguracion}
        options={{ tabBarLabel: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}
