# API Integration Guide

## 🚀 Nueva Funcionalidad: Integración con Backend API

Se ha agregado integración completa con el backend API para crear proyectos. El formulario ahora envía datos directamente al servidor backend.

### 📋 Estructura del Endpoint

**URL:** `http://localhost:5001/api/v1/projects/`  
**Método:** `POST`  
**Content-Type:** `application/json`

### 📄 Estructura de Datos

```json
{
  "name": "Nombre del proyecto",
  "description": "Descripción del proyecto",
  "startDate": "2025-12-01",
  "endDate": "2025-12-31", 
  "ownerId": 2,
  "tasks": [
    {
      "title": "Título de la tarea",
      "description": "Descripción de la tarea"
    }
  ]
}
```

### 🔧 Archivos Modificados

1. **`src/app/app.config.ts`** - Agregado HttpClient provider
2. **`src/app/models/project-stage.model.ts`** - Agregados modelos para la API
3. **`src/app/services/project.service.ts`** - Nuevo servicio para comunicación con API
4. **`src/app/project-form/project-form.component.ts`** - Actualizado para usar el servicio
5. **`src/app/project-form/project-form.component.html`** - Actualizado formulario con nuevos campos

### 🎯 Nuevos Campos en el Formulario

- **Fecha de Inicio del Proyecto**: Campo de fecha requerido
- **Fecha de Fin del Proyecto**: Campo de fecha requerido  
- **ID del Propietario**: Campo numérico (default: 1)
- **Tareas**: Cambiado de "Etapas" a "Tareas" con estructura simplificada
  - **Título**: Nombre de la tarea
  - **Descripción**: Descripción detallada de la tarea

### 🔍 Testing

#### Usando el Frontend
1. Abrir http://localhost:4200/
2. Completar el formulario con todos los campos
3. Hacer click en "Crear Proyecto"
4. El sistema mostrará un mensaje de éxito o error

#### Usando Scripts de Prueba
```bash
# En PowerShell (Windows)
.\test-api.ps1

# En Bash (Linux/Mac)
chmod +x test-api.sh
./test-api.sh
```

### ⚠️ Manejo de Errores

El frontend maneja los siguientes casos:
- ✅ **Éxito**: Muestra mensaje de confirmación y datos enviados
- ❌ **Error de validación**: Muestra errores específicos del formulario
- ❌ **Error de red**: Muestra mensaje indicando verificar el backend
- ❌ **Error del servidor**: Muestra el mensaje de error del API

### 🛠️ Funcionalidades del Servicio

#### `ProjectService` incluye:
- `createProject()` - Crear nuevo proyecto
- `getProjects()` - Obtener todos los proyectos  
- `getProjectById()` - Obtener proyecto específico
- Manejo automático de errores
- Observables RxJS para reactividad

### 🔗 Ejemplo de Curl Equivalent

```bash
curl -X POST http://localhost:5001/api/v1/projects/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Docker + Bonita Studio",
    "description": "Probando Backend Docker conectado a Bonita Studio local", 
    "startDate": "2025-12-01",
    "endDate": "2025-12-31",
    "ownerId": 2,
    "tasks": [
      {
        "title": "Configuración híbrida",
        "description": "Backend Docker + Bonita Studio funcionando"
      }
    ]
  }'
```

### 📝 Notas Importantes

1. **Backend Required**: El backend debe estar ejecutándose en `http://localhost:5001`
2. **CORS**: Asegúrate de que el backend tenga CORS configurado para `http://localhost:4200`
3. **Validación**: Todos los campos marcados con * son requeridos
4. **Estado de Loading**: El botón se deshabilita y muestra "Enviando..." durante la petición

### 🎨 UI/UX Mejoras

- Indicador visual de carga durante envío
- Mensajes de error específicos por campo
- Validación en tiempo real
- Formulario se resetea automáticamente después del envío exitoso
- Estados deshabilitados para prevenir envíos múltiples