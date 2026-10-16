import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PantallaInicio from '../screens/PantallaInicio';
import PantallaGastos from '../screens/PantallaGastos';

const Tab = createBottomTabNavigator();

// Tab: la barra inferior permite cambiar entre Inicio y Gastos.
export default function NavegadorPestanas() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 23 }}>⌂</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Gastos"
        component={PantallaGastos}
        options={{
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>☷</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
