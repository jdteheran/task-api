# API de Gestión de Proyectos y Tareas

Una API REST completa para gestionar proyectos y tareas con diferentes estados, prioridades y fechas límite, desarrollada con Bun y Elysia.

## Características

### Estados de las Tareas

Cada tarea puede tener uno de los siguientes estados:

1. **Backlog**: Tareas pendientes o recién creadas.
2. **En progreso**: Tareas que se están trabajando activamente.
3. **Finalizado**: Tareas que han sido completadas.

### Prioridades de las Tareas

Cada tarea puede tener una de las siguientes prioridades:

1. **Baja**: Tareas con baja prioridad.
2. **Media**: Tareas con prioridad media (valor por defecto).
3. **Alta**: Tareas con alta prioridad.

### Proyectos

Los proyectos permiten agrupar tareas relacionadas y tienen las siguientes características:

1. **Nombre y descripción**: Información básica del proyecto.
2. **Fecha límite**: Fecha de vencimiento del proyecto.
3. **Progreso automático**: Porcentaje calculado en base a las tareas completadas.

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
  - Body: `{ "title": "string", "description": "string", "priority": "low" | "medium" | "high", "projectId": "string", "deadline": "2023-12-31" }`
- **PUT /tasks/:id**: Actualizar una tarea existente
  - Body: `{ "title": "string", "description": "string", "priority": "low" | "medium" | "high", "deadline": "2023-12-31" }`
- **PATCH /tasks/:id/status**: Cambiar el estado de una tarea
  - Body: `{ "status": "backlog" | "in_progress" | "finished" }`
- **DELETE /tasks/:id**: Eliminar una tarea
- **GET /tasks/filter/status/:status**: Filtrar tareas por estado
- **GET /tasks/filter/priority/:priority**: Filtrar tareas por prioridad
- **GET /tasks/upcoming/:days?**: Obtener tareas próximas a vencer (por defecto 7 días)
- **GET /tasks/overdue**: Obtener tareas vencidas
- **POST /tasks/:id/comments**: Añadir un comentario a una tarea
  - Body: `{ "text": "string" }`
- **GET /tasks/:id/comments**: Obtener comentarios de una tarea

### Proyectos

- **GET /projects**: Obtener todos los proyectos
- **GET /projects/:id**: Obtener un proyecto por su ID
- **POST /projects**: Crear un nuevo proyecto
  - Body: `{ "name": "string", "description": "string", "deadline": "2023-12-31" }`
- **PUT /projects/:id**: Actualizar un proyecto existente
  - Body: `{ "name": "string", "description": "string", "deadline": "2023-12-31" }`
- **DELETE /projects/:id**: Eliminar un proyecto
- **GET /projects/:id/tasks**: Obtener todas las tareas de un proyecto
- **POST /projects/:id/tasks/:taskId**: Añadir una tarea a un proyecto
- **DELETE /projects/:id/tasks/:taskId**: Eliminar una tarea de un proyecto

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
- Añadir filtros combinados (por estado y prioridad)
- Implementar estadísticas y reportes
- Añadir sistema de etiquetas para tareas
- Implementar notificaciones para tareas próximas a vencer
