# API de Lista de Tareas (To-Do List)

Una API REST simple para gestionar tareas con diferentes estados, desarrollada con Bun y Elysia.

## Estados de las Tareas

Cada tarea puede tener uno de los siguientes estados:

1. **Backlog**: Tareas pendientes o recién creadas.
2. **En progreso**: Tareas que se están trabajando activamente.
3. **Finalizado**: Tareas que han sido completadas.

## Requisitos

- [Bun](https://bun.sh/) (v1.0.0 o superior)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd to-do-list

# Instalar dependencias
bun install
```

## Ejecución

```bash
# Iniciar el servidor en modo desarrollo
bun run index.ts
```

El servidor se ejecutará en `http://localhost:3000`.

## Endpoints de la API

### Tareas

- **GET /tasks**: Obtener todas las tareas
- **GET /tasks/:id**: Obtener una tarea por su ID
- **POST /tasks**: Crear una nueva tarea
  - Body: `{ "title": "string", "description": "string" }`
- **PUT /tasks/:id**: Actualizar una tarea existente
  - Body: `{ "title": "string", "description": "string" }`
- **PATCH /tasks/:id/status**: Cambiar el estado de una tarea
  - Body: `{ "status": "backlog" | "in_progress" | "finished" }`
- **DELETE /tasks/:id**: Eliminar una tarea
- **GET /tasks/filter/:status**: Filtrar tareas por estado

## Estructura del Proyecto

```
├── index.ts              # Punto de entrada de la aplicación
├── src/
│   ├── Utils/           # Utilidades y helpers
│   ├── controllers/     # Controladores de la API
│   ├── db/              # Configuración de base de datos (futura implementación)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   └── services/        # Lógica de negocio
└── tsconfig.json        # Configuración de TypeScript
```

## Almacenamiento

Actualmente, la API utiliza almacenamiento en memoria. Los datos se perderán al reiniciar el servidor.

## Futuras Mejoras

- Implementar persistencia de datos con una base de datos
- Añadir autenticación y autorización
- Implementar pruebas unitarias y de integración
