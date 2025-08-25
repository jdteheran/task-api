# API de Gestión de Proyectos y Tareas

Una API REST completa para gestionar proyectos y tareas con autenticación JWT, desarrollada con Bun, Elysia y MongoDB.

## Características

### 🔐 Autenticación JWT
- Sistema completo de registro y login de usuarios
- Protección de rutas con tokens JWT
- Middleware centralizado de autenticación
- Gestión segura de sesiones

### 📋 Estados de las Tareas

Cada tarea puede tener uno de los siguientes estados:

1. **Backlog**: Tareas pendientes o recién creadas
2. **En progreso**: Tareas que se están trabajando activamente
3. **Finalizado**: Tareas que han sido completadas

### ⚡ Prioridades de las Tareas

Cada tarea puede tener una de las siguientes prioridades:

1. **Baja**: Tareas con baja prioridad
2. **Media**: Tareas con prioridad media (valor por defecto)
3. **Alta**: Tareas con alta prioridad

### 📁 Proyectos

Los proyectos permiten agrupar tareas relacionadas y tienen las siguientes características:

1. **Nombre y descripción**: Información básica del proyecto
2. **Fecha límite**: Fecha de vencimiento del proyecto
3. **Progreso automático**: Porcentaje calculado en base a las tareas completadas
4. **Asociación con usuarios**: Cada proyecto pertenece a un usuario autenticado

## Requisitos

- [Bun](https://bun.sh/) (v1.0.0 o superior)
- [MongoDB](https://www.mongodb.com/) (local o remoto)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd to-do-list

# Instalar dependencias
bun install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
```

### Variables de Entorno

- **MONGODB_URI**: URI de conexión a MongoDB
- **JWT_SECRET**: Clave secreta para firmar los tokens JWT

## Ejecución

```bash
# Iniciar el servidor en modo desarrollo
bun run index.ts
```

El servidor se ejecutará en `http://localhost:3000`.

## Endpoints de la API

### 🔐 Autenticación

#### Rutas Públicas (No requieren token)

- **GET /**: Ruta principal de la API
  ```json
  {
    "message": "API de Lista de Tareas"
  }
  ```

- **POST /auth/register**: Registrar un nuevo usuario
  ```json
  {
    "username": "juan_perez",
    "email": "juan@ejemplo.com",
    "password": "mipassword123"
  }
  ```

- **POST /auth/login**: Iniciar sesión
  ```json
  {
    "email": "juan@ejemplo.com",
    "password": "mipassword123"
  }
  ```

#### Rutas Protegidas (Requieren token JWT)

- **GET /auth/profile**: Obtener perfil del usuario autenticado
  - Header: `Authorization: Bearer <jwt_token>`

### 📋 Tareas

> **Nota**: Todas las rutas de tareas requieren autenticación JWT

- **GET /api/tasks**: Obtener todas las tareas del usuario
- **GET /api/tasks/:id**: Obtener una tarea por su ID
- **POST /api/tasks**: Crear una nueva tarea
  ```json
  {
    "title": "string",
    "description": "string",
    "priority": "low" | "medium" | "high",
    "projectId": "string",
    "deadline": "2023-12-31"
  }
  ```
- **PUT /api/tasks/:id**: Actualizar una tarea existente
- **PATCH /api/tasks/:id/status**: Cambiar el estado de una tarea
  ```json
  {
    "status": "backlog" | "in_progress" | "finished"
  }
  ```
- **DELETE /api/tasks/:id**: Eliminar una tarea
- **GET /api/tasks/filter/status/:status**: Filtrar tareas por estado
- **GET /api/tasks/filter/priority/:priority**: Filtrar tareas por prioridad
- **GET /api/tasks/upcoming/:days?**: Obtener tareas próximas a vencer (por defecto 7 días)
- **GET /api/tasks/overdue**: Obtener tareas vencidas
- **POST /api/tasks/:id/comments**: Añadir un comentario a una tarea
- **GET /api/tasks/:id/comments**: Obtener comentarios de una tarea

### 📁 Proyectos

> **Nota**: Todas las rutas de proyectos requieren autenticación JWT

- **GET /api/projects**: Obtener todos los proyectos del usuario
- **GET /api/projects/:id**: Obtener un proyecto por su ID
- **POST /api/projects**: Crear un nuevo proyecto
  ```json
  {
    "name": "string",
    "description": "string",
    "deadline": "2023-12-31"
  }
  ```
- **PUT /api/projects/:id**: Actualizar un proyecto existente
- **DELETE /api/projects/:id**: Eliminar un proyecto
- **GET /api/projects/:id/tasks**: Obtener todas las tareas de un proyecto
- **POST /api/projects/:id/tasks/:taskId**: Añadir una tarea a un proyecto
- **DELETE /api/projects/:id/tasks/:taskId**: Eliminar una tarea de un proyecto

## Uso de la API

### Ejemplo de Registro y Login

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan@ejemplo.com",
    "password": "mipassword123"
  }'

# 2. Iniciar sesión
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "mipassword123"
  }'

# 3. Usar el token devuelto para acceder a rutas protegidas
curl -H "Authorization: Bearer <jwt_token>" \
     http://localhost:3000/api/tasks

# 4. Crear una nueva tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Descripción de la tarea",
    "priority": "high",
    "deadline": "2024-12-31"
  }'

# 5. Crear un proyecto
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "name": "Mi Proyecto",
    "description": "Descripción del proyecto",
    "deadline": "2024-12-31"
  }'
```

### Formato de Autorización

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <jwt_token>
```

## Estructura del Proyecto

```
├── .gitignore              # Archivos y carpetas a ignorar en Git
├── README.md               # Documentación del proyecto
├── bun.lock                # Archivo de bloqueo de dependencias
├── index.ts                # Punto de entrada de la aplicación
├── package.json            # Configuración del proyecto y dependencias
├── src/
│   ├── Utils/              # Utilidades y helpers
│   │   ├── ApiResponse.ts  # Formato estándar de respuestas
│   │   └── ErrorMiddleware.ts # Middleware de manejo de errores
│   ├── controllers/        # Controladores de la API
│   │   ├── AuthController.ts    # Autenticación JWT
│   │   ├── TaskController.ts    # Gestión de tareas
│   │   └── ProjectController.ts # Gestión de proyectos
│   ├── db/                 # Configuración de base de datos
│   │   └── connection.ts   # Conexión a MongoDB
│   ├── middleware/         # Middlewares personalizados
│   │   └── auth.ts         # Middleware de autenticación JWT
│   ├── models/             # Modelos de datos (Mongoose)
│   │   ├── User.ts         # Interfaces de usuario
│   │   ├── User.schema.ts  # Esquema Mongoose de usuario
│   │   ├── Task.ts         # Interfaces de tarea
│   │   ├── Task.schema.ts  # Esquema Mongoose de tarea
│   │   ├── Project.ts      # Interfaces de proyecto
│   │   └── Project.schema.ts # Esquema Mongoose de proyecto
│   ├── routes/             # Definición de rutas
│   │   └── index.ts        # Rutas principales
│   └── services/           # Lógica de negocio
│       ├── AuthService.ts      # Servicios de autenticación
│       ├── TaskService.ts      # Servicios de tareas
│       └── ProjectService.ts   # Servicios de proyectos
├── .env                    # Variables de entorno (no incluir en git)
└── tsconfig.json          # Configuración de TypeScript
```

## Base de Datos

La aplicación utiliza **MongoDB** con **Mongoose** para:

- **Persistencia de datos**: Todos los datos se almacenan en MongoDB
- **Modelos relacionales**: Usuarios, tareas y proyectos están relacionados
- **Validaciones**: Esquemas de validación con Mongoose
- **Índices**: Optimización de consultas

### Modelos de Datos

- **User**: Información del usuario (username, email, contraseña hasheada, fechas de creación/actualización)
- **Task**: Tareas con título, descripción, estado (backlog/in_progress/finished), prioridad (low/medium/high), proyecto opcional, fecha límite opcional y comentarios
- **Project**: Proyectos con nombre, descripción, fecha límite, lista de IDs de tareas y progreso automático calculado

## Seguridad

### Autenticación JWT
- Tokens seguros con expiración
- Contraseñas hasheadas con bcrypt
- Middleware de protección de rutas
- Validación de tokens en cada request

### Validaciones
- Validación de entrada con esquemas Elysia
- Sanitización de datos
- Manejo seguro de errores

## Manejo de Errores

### Códigos de Respuesta
- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Error en los datos enviados
- **401**: No autorizado (token inválido/faltante)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Formato de Respuesta
```json
{
  "success": true|false,
  "message": "Descripción del resultado",
  "data": {} // Datos de respuesta o null
}
```

## Tecnologías Utilizadas

- **[Bun](https://bun.sh/)**: Runtime y package manager
- **[Elysia](https://elysiajs.com/)**: Framework web rápido y type-safe
- **[MongoDB](https://www.mongodb.com/)**: Base de datos NoSQL
- **[Mongoose](https://mongoosejs.com/)**: ODM para MongoDB
- **[JWT](https://jwt.io/)**: Autenticación con tokens (jsonwebtoken)
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**: Hash de contraseñas
- **[UUID](https://www.npmjs.com/package/uuid)**: Generación de identificadores únicos
- **TypeScript**: Tipado estático

## Futuras Mejoras

- ✅ ~~Implementar persistencia de datos con una base de datos~~ (Completado)
- ✅ ~~Añadir autenticación y autorización~~ (Completado)
- 🔄 Implementar pruebas unitarias y de integración
- 🔄 Añadir filtros combinados (por estado y prioridad)
- 🔄 Implementar estadísticas y reportes
- 🔄 Añadir sistema de etiquetas para tareas
- 🔄 Implementar notificaciones para tareas próximas a vencer
- 🔄 Añadir roles y permisos de usuario
- 🔄 Implementar colaboración en proyectos
- 🔄 Añadir API de webhooks

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
