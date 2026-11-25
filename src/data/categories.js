// Lista única de categorías. En cada gasto solo se guarda el nombre;
// el color y el ícono se obtienen siempre desde acá.
export const CATEGORIES = [
  { nombre: 'Comida', color: '#16A34A', icono: 'restaurant-outline' },
  { nombre: 'Transporte', color: '#2563EB', icono: 'car-outline' },
  { nombre: 'Servicios', color: '#9333EA', icono: 'home-outline' },
  { nombre: 'Otros', color: '#EA580C', icono: 'pricetag-outline' },
];

export const DEFAULT_CATEGORY = CATEGORIES[0].nombre;

// Devuelve la categoría por nombre; si no existe, usa "Otros".
export function getCategory(nombre) {
  return (
    CATEGORIES.find((categoria) => categoria.nombre === nombre) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}