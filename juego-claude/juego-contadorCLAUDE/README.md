# JuegoContador

Challenge Técnico — React | Desarrollador FrontEnd Junior

Un juego donde el usuario intenta hacer la mayor cantidad de clicks posible en **5 segundos**, compitiendo contra su propio récord.

---

## Funcionalidades

- Cuenta regresiva visual con mensajes: **"Preparados..."**, **"Listos..."**, **"¡Ya!"** (intervalos de 1 segundo)
- Botón de inicio que se deshabilita durante el juego y se rehabilita al terminar
- Botón de click habilitado únicamente durante los 5 segundos de juego
- Contador de clicks en tiempo real
- Barra de progreso y temporizador visible durante la partida
- Marcador de **puntaje máximo** que se actualiza si se supera
- Mensaje de **"Nuevo récord"** al batir el máximo
- Diseño responsivo, funciona en mobile y desktop

---

## Tecnologías

- **React 18** con hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **Vite** como bundler y dev server
- **CSS Modules** para estilos con scope local
- Sin librerías de UI externas — 100% custom

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

---

## Cómo correr el proyecto localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/juego-contador.git
cd juego-contador

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Luego abrí tu navegador en [http://localhost:5173](http://localhost:5173)

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción localmente |

---

## Estructura del proyecto

```
juego-contador/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Componente principal con toda la lógica del juego
│   ├── App.module.css   # Estilos del componente (CSS Modules)
│   ├── index.css        # Estilos globales y variables CSS
│   └── main.jsx         # Entry point de React
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Decisiones de diseño

- **CSS Variables globales** para mantener consistencia del tema oscuro en toda la app.
- **`requestAnimationFrame`** para el temporizador del juego — mayor precisión y sin drift comparado con `setInterval`.
- **`useRef`** para el contador de clicks dentro del loop de animación, evitando closures desactualizadas.
- **Máquina de estados explícita** con la constante `PHASE` (`idle`, `countdown`, `playing`, `finished`) para que el flujo del juego sea predecible y fácil de mantener.
- **CSS Modules** para evitar colisiones de nombres y mantener los estilos colocados junto al componente.

---

## Consideraciones

El puntaje máximo se almacena en el estado de React (en memoria). Si se recarga la página, el récord se reinicia. Para persistencia se podría agregar `localStorage` en el futuro.
