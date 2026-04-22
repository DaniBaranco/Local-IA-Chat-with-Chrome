# Agentes para Genio Gemini Nano

Este proyecto utiliza un sistema de agentes especializados que colaboran para desarrollar y mantener la aplicación de chat local con Gemini Nano.

## Agentes Disponibles

### CoordinatorAgent
**Rol**: Coordinador principal del proyecto
**Uso**: Para planificación de tareas, asignación de trabajo y coordinación entre agentes
**Comando**: `@CoordinatorAgent`

### FrontendAgent
**Rol**: Especialista en interfaz de usuario y experiencia
**Uso**: Desarrollo de HTML, CSS, JavaScript, UI/UX, responsive design
**Comando**: `@FrontendAgent`

### TestAgent
**Rol**: Especialista en pruebas y calidad
**Uso**: Escritura y ejecución de pruebas unitarias, integración, debugging
**Comando**: `@TestAgent`

### SecurityAgent
**Rol**: Especialista en seguridad
**Uso**: Revisión de vulnerabilidades, validación de inputs, prevención XSS
**Comando**: `@SecurityAgent`

## Flujo de Trabajo Colaborativo

1. **CoordinatorAgent** recibe el requerimiento inicial
2. Analiza el impacto y divide en subtareas
3. Asigna tareas específicas a agentes especializados usando subagentes
4. Cada agente ejecuta su tarea y reporta resultados
5. CoordinatorAgent integra feedback y asegura consistencia
6. Validación cruzada entre agentes (ej: SecurityAgent revisa cambios de FrontendAgent)

## Conexiones Lógicas

- **CoordinatorAgent** → Invoca subagentes para tareas específicas
- **FrontendAgent** ↔ **TestAgent**: Frontend proporciona código testable, TestAgent valida funcionalidad
- **FrontendAgent** ↔ **SecurityAgent**: Frontend implementa defensas, SecurityAgent valida efectividad
- **TestAgent** ↔ **SecurityAgent**: Tests incluyen casos de seguridad, SecurityAgent asegura cobertura

## Uso en VS Code

Para usar un agente específico, menciona su nombre con @ en el chat de Copilot:
- `@CoordinatorAgent Implementa nueva funcionalidad X`
- `@FrontendAgent Mejora el diseño de la sidebar`
- `@TestAgent Agrega pruebas para la nueva función`
- `@SecurityAgent Revisa este código por vulnerabilidades`

Los agentes pueden invocar otros agentes automáticamente para colaboración cuando sea necesario.