# Persistencia de datos — ExpenseTracker Sprint 3

## 1. Introducción

Durante el Sprint 3 implementamos la persistencia de datos en las dos versiones de ExpenseTracker: React Native y PWA.

El objetivo fue guardar los gastos, recuperarlos al iniciar las aplicaciones y sincronizarlos mediante Cloud Firestore.

También realizamos pruebas para comprobar cómo se comportan las aplicaciones cuando no tienen conexión a Internet.

## 2. Arquitectura de persistencia

Utilizamos diferentes tecnologías según el tipo de información:

| Tecnología | Aplicación | Información almacenada |
|---|---|---|
| AsyncStorage | React Native | Ajustes de notificaciones y modo oscuro |
| localStorage | PWA | Ajustes de notificaciones y modo oscuro |
| Cloud Firestore | Ambas | Gastos registrados |
| IndexedDB | PWA | Caché persistente de Firestore |

Al comenzar el Sprint, implementamos el almacenamiento local de gastos y ajustes con AsyncStorage en React Native y localStorage en la PWA.

Posteriormente reemplazamos el almacenamiento de gastos por Firestore, manteniendo los ajustes en el almacenamiento local de cada aplicación.

## 3. Context y carga de datos

Ambas aplicaciones utilizan `ExpensesContext` para centralizar los gastos y compartirlos entre las pantallas.

El Context proporciona las funciones `addExpense()` y `removeExpense()` para agregar y eliminar gastos.

También utiliza `isLoaded` para controlar la carga de datos.

En React Native, AsyncStorage recupera los ajustes de forma asíncrona. En la PWA, localStorage permite recuperarlos de forma síncrona.

Los gastos se obtienen desde Firestore utilizando `onSnapshot()`, que escucha los cambios de la colección en tiempo real.

## 4. Conexión con Cloud Firestore

Creamos un proyecto Firebase llamado ExpenseTracker y una colección denominada `expenses`.

Ambas aplicaciones utilizan el mismo proyecto y la misma colección, por lo que pueden compartir los gastos registrados.

Los documentos de Firestore contienen los siguientes campos:

- `title`: descripción del gasto.
- `amount`: monto.
- `category`: categoría.
- `notes`: notas adicionales.
- `createdAt`: fecha y hora de creación.

Dentro de las aplicaciones conservamos los nombres de los campos en español: `descripcion`, `monto`, `categoria`, `notas` y `fecha`.

El Context se encarga de convertir los datos entre ambos formatos.

Para agregar gastos utilizamos `addDoc()`, para eliminarlos `deleteDoc()` y para escuchar cambios `onSnapshot()`.

### Sincronización entre aplicaciones

Comprobamos que un gasto registrado desde React Native aparece en la PWA.

También comprobamos el funcionamiento inverso: un gasto creado desde la PWA aparece en React Native.

Finalmente, eliminamos un gasto desde la PWA y verificamos que desapareció de ambas aplicaciones y de Firebase Console.

## 5. Pruebas offline de React Native

Realizamos cuatro pruebas utilizando Expo Go en Android.

### Prueba 1: crear un gasto sin conexión

Activamos el modo avión y registramos "Prueba Offline 1" por $1.500.

**Resultado:** El gasto apareció en el listado aunque el dispositivo no tenía Internet.

### Prueba 2: recuperar la conexión

Desactivamos el modo avión y recuperamos la conexión Wi-Fi.

**Resultado:** El gasto se sincronizó correctamente y apareció en Firebase Console.

### Prueba 3: cerrar la aplicación con un gasto pendiente

Sin conexión, registramos "Prueba Offline 2" por $2.300 y cerramos completamente Expo Go.

Después recuperamos Internet y volvimos a abrir la aplicación.

**Resultado:** El gasto no se conservó y tampoco apareció en Firestore.

En nuestra implementación, Firestore utiliza una caché en memoria en React Native, por lo que los cambios pendientes pueden perderse al cerrar la aplicación antes de sincronizarlos.

### Prueba 4: iniciar sin conexión

Cerramos Expo Go y tratamos de abrir ExpenseTracker con el modo avión activado.

**Resultado:** Apareció el mensaje "Something went wrong" y no pudimos completar la prueba.

El inconveniente probablemente estuvo relacionado con el servidor de desarrollo Metro. Por lo tanto, esta prueba no permite determinar si Firestore podía recuperar los gastos al iniciar sin conexión.

Al recuperar Internet, la aplicación volvió a funcionar correctamente.

## 6. Pruebas offline de la PWA

En la PWA configuramos Firestore con caché persistente mediante IndexedDB.

### Prueba 1: crear un gasto sin conexión

Desactivamos el Wi-Fi de la computadora y registramos "Prueba Offline PWA 1" por $1.800.

**Resultado:** El gasto apareció correctamente en el listado sin necesidad de Internet.

### Prueba 2: recuperar la conexión

Volvimos a activar el Wi-Fi y mantuvimos la PWA abierta.

**Resultado:** El gasto se sincronizó automáticamente y apareció en Firebase Console.

### Prueba 3: cerrar el navegador con un gasto pendiente

Desactivamos el Wi-Fi y registramos "Prueba Offline PWA 2" por $2.300.

Después cerramos completamente el navegador, recuperamos Internet y volvimos a abrir la PWA.

**Resultado:** El gasto se conservó y se sincronizó correctamente con Firestore.

Esta prueba permitió comprobar el funcionamiento de la caché persistente de IndexedDB.

### Prueba 4: iniciar sin conexión

Con los datos previamente cargados, cerramos el navegador, desactivamos el Wi-Fi e ingresamos nuevamente a ExpenseTracker desde `localhost`.

**Resultado:** La PWA abrió correctamente sin conexión a Internet.

Esta prueba se realizó en el entorno local de desarrollo. No reemplaza una prueba de instalación y apertura offline de la versión publicada.

## 7. Comparación entre React Native y PWA

| Característica | React Native | PWA |
|---|---|---|
| Almacenamiento de ajustes | AsyncStorage | localStorage |
| Almacenamiento de gastos | Cloud Firestore | Cloud Firestore |
| Tipo de caché Firestore configurada | En memoria | Persistente con IndexedDB |
| Crear un gasto sin conexión | Funcionó | Funcionó |
| Sincronizar al recuperar Internet | Funcionó | Funcionó |
| Conservar un gasto pendiente después de cerrar | No funcionó en la prueba | Funcionó |
| Abrir desde cero sin Internet | Prueba bloqueada por Expo Go | Funcionó en localhost |

La diferencia principal que observamos está en el almacenamiento offline.

En React Native, el gasto pendiente se perdió después de cerrar Expo Go.

En cambio, en la PWA el gasto pendiente se conservó gracias a la persistencia configurada mediante IndexedDB y pudo sincronizarse posteriormente.

## 8. Persistencia de ajustes

En ambas aplicaciones implementamos las preferencias `notificaciones` y `modoOscuro`.

En React Native se almacenan mediante AsyncStorage.

En la PWA se almacenan mediante localStorage.

Comprobamos que los interruptores de la PWA conservan sus valores después de recargar la página.

En React Native quedó pendiente comprobar específicamente la conservación de los ajustes después de cerrar y volver a abrir la aplicación.

Los interruptores almacenan las preferencias, pero no activan notificaciones reales ni modifican todavía el tema visual completo.

## 9. Evidencias y limitaciones

Las capturas de las pruebas se organizan en la carpeta `capturas` de cada proyecto.

Quedaron pendientes algunas capturas de pantalla por inconvenientes con la herramienta de recortes de Windows.

También queda pendiente realizar una prueba offline de la versión publicada de la PWA.

Las reglas de Firestore utilizadas durante el desarrollo se configuraron inicialmente en modo de prueba. Antes de utilizar datos reales o publicar una aplicación para producción, es necesario reemplazarlas por reglas de acceso seguras.

## 10. Conclusión

Durante el Sprint 3 conseguimos conectar React Native y la PWA a una misma base de datos Cloud Firestore.

Comprobamos que los gastos se pueden registrar, consultar, eliminar y sincronizar entre ambas aplicaciones.

También verificamos la creación de gastos sin conexión y su posterior sincronización.

Las pruebas permitieron identificar una diferencia importante: nuestra PWA conserva cambios pendientes después de cerrar el navegador, mientras que en React Native observamos que podían perderse al cerrar Expo Go.

La implementación cumple con los objetivos principales de persistencia y sincronización, aunque todavía quedan algunas evidencias y pruebas complementarias pendientes.

## 11. Bonus (US #7)

En React Native implementamos los tres puntos del Bonus.

### 11.1 Editar un gasto

Agregamos al Context la función `updateExpense(id, data)`, que usa `updateDoc()` para modificar `title`, `amount`, `category` y `notes` del documento. El campo `createdAt` no cambia. Igual que al agregar un gasto, no esperamos la respuesta del servidor, por lo que la edición también funciona sin conexión y `onSnapshot()` muestra el cambio desde la caché local.

Reutilizamos el formulario de alta: si recibe un `id` por parámetro, funciona en modo edición. Precarga los datos del gasto, cambia el título a "Editar gasto" y guarda con `updateExpense`. Para eso agregamos el campo de notas al formulario y un botón "Editar" en la pantalla de detalle.

La comprobación de que la edición se ve en tiempo real en la PWA no se hizo desde este repositorio.

### 11.2 Indicador de conexión

Instalamos `@react-native-community/netinfo` y creamos el componente `AvisoSinConexion`, que usa el hook `useNetInfo()` y muestra un cartel "Sin conexión" cuando el dispositivo no tiene conexión. Se monta en `App.js` sobre la navegación. Lo probamos activando y desactivando el modo avión.

### 11.3 Autenticación anónima

Inicializamos Firebase Authentication en `firebase.js` con `initializeAuth` y `getReactNativePersistence(AsyncStorage)`, para que la sesión se conserve al cerrar la app. En el Context, `onAuthStateChanged` recupera la sesión guardada y, si no existe, llama a `signInAnonymously()`. Al reabrir la app se mantiene el mismo usuario.

Los gastos pasaron a guardarse en `users/{uid}/expenses`. El listado espera a tener el `uid` antes de suscribirse con `onSnapshot()`, y el alta, la baja y la edición usan la misma ruta.

**Limitación:** la primera vez que se abre la app hace falta conexión para crear la sesión anónima. Después, la sesión guardada permite abrirla sin conexión.

**Reglas de Firestore propuestas.** Para que cada persona solo pueda leer y escribir sus propios gastos:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

No las publicamos. Hoy el proyecto usa reglas de modo de prueba (válidas hasta el 25/12/2026) y publicarlas dejaría a la PWA sin acceso a la colección `expenses`, que sigue usando.

**Consecuencia: las apps ya no comparten gastos.** Cada aplicación tiene su propio usuario anónimo, con un `uid` distinto, por lo que cada una ve solo sus datos. Los gastos que ya estaban en la colección `expenses` no se muestran en la app móvil porque no los migramos.

**Cómo lo resolveríamos:**

1. Usar una identidad que sea la misma en ambas apps, por ejemplo inicio de sesión con email y contraseña o con Google, en la app móvil y en la PWA. Una misma persona tendría el mismo `uid` en las dos y ambas leerían `users/{uid}/expenses`.
2. Para no perder los gastos ya cargados, convertir la cuenta anónima en una cuenta permanente con `linkWithCredential()`, que conserva el `uid`.
3. Migrar los documentos de la colección `expenses` a la ruta del usuario.