# Base44 Plantas - Monorepo HTML

Sistema de gestión de inventario de plantas desarrollado como monorepo con HTML, CSS y JavaScript vanilla.

## 🏗️ Estructura del Proyecto

```
BASE44PLANTAS/
├── packages/                  # Paquetes compartidos
│   ├── api-client/           # Cliente de API Base44
│   ├── ui-components/        # Componentes UI reutilizables
│   └── utils/                # Utilidades compartidas
│
├── apps/                     # Aplicaciones
│   └── plant-manager/        # Aplicación principal
│       ├── index.html        # Dashboard principal
│       ├── pages/            # Páginas HTML
│       ├── js/               # Scripts de la aplicación
│       ├── css/              # Estilos
│       └── assets/           # Recursos estáticos
│
├── package.json              # Configuración del monorepo
└── README.md                 # Este archivo
```

## 🚀 Comenzando

### Requisitos Previos

- Node.js 18+ (para servidor de desarrollo)
- Navegador moderno con soporte para ES6 Modules

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd BASE44PLANTAS

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:8080`

**Alternativas:**

```bash
# Con Python
npm run dev:manager

# O cualquier servidor HTTP estático
cd apps/plant-manager
python3 -m http.server 8080
```

## 📦 Paquetes

### @base44plantas/api-client

Cliente de API para comunicación con Base44 backend.

### @base44plantas/ui-components

Componentes UI reutilizables en vanilla JavaScript.

### @base44plantas/utils

Utilidades y helpers compartidos.

## 🎨 Aplicación: Plant Manager

### Características

- ✅ Dashboard con vista de todas las plantas
- ✅ Búsqueda y filtrado en tiempo real
- ✅ Creación de nuevas plantas
- ✅ Vista detallada de cada planta
- ✅ Generación de códigos QR
- ✅ Exportación a CSV/Excel
- ✅ Sistema de gestión de stock
- ✅ Responsive design
- ✅ Control de acceso por roles

## 🔧 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos
- **Tailwind CSS** - Framework CSS (CDN)
- **JavaScript ES6+** - Lógica de aplicación
- **ES Modules** - Sistema de módulos nativo
- **Fetch API** - Comunicación con backend

## 📄 Licencia

MIT License

## 📧 Soporte

Para soporte y preguntas, contacta a: app@base44.com

---

**Desarrollado con ❤️ para Base44**