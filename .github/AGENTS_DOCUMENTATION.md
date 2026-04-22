# Documentación de Agentes - Proyecto Genio Gemini Nano

**Fecha de creación:** 22 de abril de 2026  
**Versión:** 1.0  
**Proyecto:** Genio Gemini Nano - Aplicación de chat local con IA  
**Propósito:** Esta documentación detalla las funciones, responsabilidades y flujos de trabajo de cada agente especializado en el proyecto, diseñado para compartir en Confluence.

---

## 1. Visión General del Sistema de Agentes

El proyecto Genio Gemini Nano utiliza un sistema colaborativo de agentes especializados basados en VS Code Copilot. Este enfoque permite una división clara de responsabilidades, retroalimentación automática entre agentes y un flujo de desarrollo estructurado que asegura calidad, seguridad y consistencia.

### Arquitectura del Sistema
- **Agente Principal (CoordinatorAgent)**: Orquesta el trabajo y coordina entre agentes especializados
- **Agentes Especializados**: FrontendAgent, TestAgent, SecurityAgent
- **Conexiones Lógicas**: Retroalimentación bidireccional entre agentes para validación cruzada
- **Herramientas**: VS Code Copilot con archivos de configuración personalizados (.agent.md)

### Beneficios del Sistema
- **Especialización**: Cada agente tiene expertise en su dominio
- **Colaboración**: Retroalimentación automática reduce errores
- **Eficiencia**: Desarrollo paralelo con validación integrada
- **Calidad**: Cobertura completa de aspectos técnicos y de seguridad

---

## 2. CoordinatorAgent - Coordinador Principal

### Descripción General
El CoordinatorAgent actúa como el director de orquesta del proyecto, gestionando tareas complejas, asignando responsabilidades y asegurando la integración entre todos los componentes del sistema.

### Responsabilidades Principales
- **Planificación Estratégica**: Analizar requerimientos y dividirlos en subtareas manejables
- **Asignación de Recursos**: Distribuir tareas entre agentes especializados según expertise
- **Coordinación de Equipo**: Facilitar comunicación y retroalimentación entre agentes
- **Control de Calidad**: Asegurar que todos los aspectos (frontend, testing, seguridad) sean abordados
- **Gestión de Proyectos**: Mantener consistencia en código, documentación y mejores prácticas

### Funciones Específicas
- Recibir requerimientos del usuario y descomponerlos
- Invocar subagentes usando `runSubagent` para tareas especializadas
- Integrar resultados de diferentes agentes
- Validar que cambios cumplan con estándares del proyecto
- Documentar decisiones y cambios en README.md

### Flujo de Trabajo Típico
1. **Análisis**: Evaluar complejidad y impacto del requerimiento
2. **Planificación**: Crear plan de tareas con dependencias
3. **Ejecución**: Asignar tareas a agentes apropiados
4. **Integración**: Combinar resultados y resolver conflictos
5. **Validación**: Ejecutar tests y revisiones de seguridad
6. **Documentación**: Actualizar documentación del proyecto

### Métricas de Éxito
- Tareas completadas sin conflictos entre agentes
- Cobertura completa de testing y seguridad
- Mantenimiento de estándares de código
- Retroalimentación efectiva entre agentes

### Comando de Invocación
```
@CoordinatorAgent [descripción de tarea]
```

---

## 3. FrontendAgent - Especialista en Interfaz de Usuario

### Descripción General
El FrontendAgent es el experto en desarrollo frontend, responsable de crear y mantener una interfaz de usuario moderna, accesible y responsive que proporcione una experiencia óptima en todos los dispositivos.

### Responsabilidades Principales
- **Desarrollo de UI**: Crear y mantener componentes HTML, CSS y JavaScript
- **Experiencia de Usuario**: Diseñar interacciones intuitivas y feedback visual
- **Responsive Design**: Asegurar funcionalidad óptima en desktop, tablet y mobile
- **Accesibilidad**: Implementar estándares WCAG para usuarios con discapacidades
- **Optimización de Rendimiento**: Mejorar carga, animaciones y uso de recursos

### Áreas de Expertise
- **HTML**: Estructura semántica, accesibilidad, SEO básico
- **CSS**: Layouts modernos (Flexbox/Grid), temas, animaciones, responsive
- **JavaScript**: DOM manipulation, event handling, integración con APIs
- **UX Design**: Interacciones, estados de carga, feedback visual
- **Performance**: Optimización de assets, lazy loading, smooth animations

### Funciones Específicas
- Implementar nuevas funcionalidades de UI/UX
- Mantener consistencia visual y de interacción
- Optimizar para diferentes dispositivos y navegadores
- Integrar con lógica de IA (Gemini Nano API)
- Colaborar con TestAgent para asegurar testabilidad
- Coordinar con SecurityAgent para validación de inputs

### Flujo de Trabajo Típico
1. **Análisis de Requerimiento**: Entender necesidades de UI/UX
2. **Diseño**: Crear prototipos y especificaciones
3. **Implementación**: Desarrollar componentes y estilos
4. **Testing**: Validar funcionalidad con TestAgent
5. **Seguridad**: Revisar con SecurityAgent
6. **Optimización**: Refinar performance y accesibilidad

### Herramientas y Tecnologías
- **Lenguajes**: HTML5, CSS3, JavaScript ES6+
- **Metodologías**: Mobile-first, BEM CSS, vanilla JS
- **Herramientas**: DevTools, Lighthouse, WAVE accessibility checker
- **APIs**: LanguageModel API, localStorage, DOM APIs

### Métricas de Éxito
- Puntajes altos en Lighthouse (Performance, Accessibility, SEO)
- Compatibilidad cross-browser y cross-device
- Feedback positivo de usuarios en testing
- Cumplimiento de estándares de accesibilidad

### Comando de Invocación
```
@FrontendAgent [descripción de tarea frontend]
```

---

## 4. TestAgent - Especialista en Calidad y Testing

### Descripción General
El TestAgent es el guardián de la calidad del código, responsable de crear, ejecutar y mantener una suite completa de pruebas que valide la funcionalidad, rendimiento y robustez de la aplicación.

### Responsabilidades Principales
- **Desarrollo de Pruebas**: Crear y mantener tests unitarios, integración y UI
- **Ejecución de Suites**: Correr tests automáticamente y reportar resultados
- **Cobertura de Código**: Asegurar que funcionalidades críticas estén probadas
- **Debugging**: Identificar y resolver fallos en código y tests
- **QA Automation**: Implementar procesos de testing automatizados

### Tipos de Pruebas Gestionadas
- **Unitarias**: Funciones individuales y módulos
- **Integración**: Flujos completos y interacciones entre componentes
- **UI/UX**: Interacciones del usuario y comportamiento visual
- **Seguridad**: Validación de inputs y prevención de vulnerabilidades
- **Performance**: Tests de carga y rendimiento básico
- **Regresión**: Validar que cambios no rompan funcionalidad existente

### Funciones Específicas
- Escribir tests para nuevas funcionalidades
- Ejecutar suites completas (`npm test`, `npm run test:security`)
- Analizar cobertura y identificar gaps
- Depurar fallos y proporcionar feedback detallado
- Colaborar con FrontendAgent para código testable
- Coordinar con SecurityAgent para tests de seguridad

### Flujo de Trabajo Típico
1. **Análisis**: Revisar código nuevo o modificado
2. **Planificación**: Identificar casos de prueba necesarios
3. **Implementación**: Escribir tests con Jest y jsdom
4. **Ejecución**: Correr tests y analizar resultados
5. **Debugging**: Resolver fallos encontrados
6. **Reporting**: Comunicar estado al CoordinatorAgent

### Herramientas y Tecnologías
- **Framework**: Jest con jsdom environment
- **Cobertura**: Jest coverage reports
- **CI/CD**: Scripts npm para testing automatizado
- **Debugging**: Console logging, breakpoints, stack traces
- **Mocking**: Simulación de APIs y entornos de testing

### Métricas de Éxito
- Cobertura de código > 80%
- Todos los tests pasan en cada commit
- Tiempo de ejecución de tests < 10 segundos
- Detección temprana de bugs y regresiones

### Comando de Invocación
```
@TestAgent [descripción de tarea de testing]
```

---

## 5. SecurityAgent - Especialista en Seguridad

### Descripción General
El SecurityAgent es el protector de la aplicación, enfocado en identificar, prevenir y mitigar vulnerabilidades de seguridad, especialmente críticas en aplicaciones web que manejan datos sensibles.

### Responsabilidades Principales
- **Análisis de Seguridad**: Revisar código por vulnerabilidades conocidas
- **Validación de Inputs**: Implementar sanitización y validación robusta
- **Prevención de Ataques**: Proteger contra XSS, CSRF, injection attacks
- **Gestión de Datos**: Asegurar manejo seguro de información sensible
- **Cumplimiento**: Mantener estándares de seguridad web

### Áreas de Enfoque Críticas
- **XSS Prevention**: Sanitización de contenido dinámico
- **Input Validation**: Validación y escape de datos de usuario
- **Content Security Policy**: Implementar CSP headers
- **Data Handling**: Almacenamiento seguro (localStorage, sessionStorage)
- **API Security**: Validación de interacciones con LanguageModel API

### Funciones Específicas
- Revisar código nuevo para vulnerabilidades
- Implementar defensas de seguridad (sanitización, validation)
- Crear tests específicos de seguridad
- Auditar configuraciones y dependencias
- Proporcionar guías de mejores prácticas
- Colaborar con FrontendAgent para implementación segura
- Coordinar con TestAgent para validación de seguridad

### Flujo de Trabajo Típico
1. **Análisis de Riesgos**: Identificar puntos vulnerables
2. **Revisión de Código**: Auditar implementaciones
3. **Implementación**: Añadir defensas y validaciones
4. **Testing**: Ejecutar tests de seguridad
5. **Validación**: Confirmar efectividad de medidas
6. **Documentación**: Actualizar guías de seguridad

### Herramientas y Tecnologías
- **Análisis**: Code review manual, herramientas de scanning
- **Testing**: Tests específicos de seguridad con Jest
- **Defensas**: Input sanitization, CSP, secure headers
- **Monitoreo**: Logging de seguridad, error tracking
- **Estándares**: OWASP guidelines, WCAG security

### Métricas de Éxito
- Cero vulnerabilidades críticas en producción
- Tests de seguridad pasan 100%
- Cumplimiento de mejores prácticas de seguridad
- Respuesta rápida a incidentes de seguridad

### Comando de Invocación
```
@SecurityAgent [descripción de tarea de seguridad]
```

---

## 6. Flujos de Colaboración entre Agentes

### Coordinación Frontend ↔ Testing
- **FrontendAgent** proporciona código con hooks para testing
- **TestAgent** valida funcionalidad y proporciona feedback de testabilidad
- **Retroalimentación**: Mejoras en arquitectura para mejor testing

### Coordinación Frontend ↔ Seguridad
- **FrontendAgent** implementa defensas básicas
- **SecurityAgent** audita y mejora implementaciones
- **Retroalimentación**: Guías de implementación segura

### Coordinación Testing ↔ Seguridad
- **TestAgent** incluye casos de seguridad en suites
- **SecurityAgent** proporciona especificaciones de tests
- **Retroalimentación**: Cobertura completa de escenarios de ataque

### Coordinación con CoordinatorAgent
- **CoordinatorAgent** invoca agentes según necesidad
- **Agentes especializados** reportan progreso y bloqueos
- **Retroalimentación**: Ajustes en planificación y prioridades

---

## 7. Mejores Prácticas y Gobernanza

### Comunicación
- Usar comandos específicos para invocar agentes
- Proporcionar contexto detallado en solicitudes
- Documentar decisiones y cambios

### Calidad
- Ejecutar tests después de cada cambio significativo
- Revisar seguridad en todas las modificaciones
- Mantener documentación actualizada

### Escalabilidad
- Añadir nuevos agentes según crecimiento del proyecto
- Mantener interfaces consistentes entre agentes
- Regular revisiones del sistema de agentes

---

## 8. Conclusión

El sistema de agentes de Genio Gemini Nano proporciona una estructura colaborativa eficiente que asegura desarrollo de alta calidad, seguridad robusta y experiencia de usuario excepcional. Cada agente aporta su expertise especializada mientras mantiene comunicación fluida y retroalimentación efectiva.

Para más información sobre implementación específica o modificaciones al sistema, contactar al equipo de desarrollo.

---

**Documentado por:** GitHub Copilot Agents System  
**Revisado por:** CoordinatorAgent  
**Aprobado para Confluence:** Sí