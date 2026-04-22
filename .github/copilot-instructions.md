---
description: "Instrucciones globales para el proyecto Genio Gemini Nano - app de chat local con IA"
---

# Instrucciones para Genio Gemini Nano

## Contexto del Proyecto
- **Tipo**: Aplicación web de chat local usando Gemini Nano (WebLLM)
- **Tecnologías**: HTML/CSS/JavaScript vanilla, Jest para tests
- **Características**: Chat offline, temas dark/light, historial local, modo desarrollo con mock
- **Seguridad**: Enfoque en prevención XSS, validación de inputs

## Equipo de Agentes
Usa los agentes especializados para tareas específicas:
- **@CoordinatorAgent**: Coordinación general y planificación
- **@FrontendAgent**: UI/UX, HTML, CSS, JavaScript
- **@TestAgent**: Pruebas unitarias e integración
- **@SecurityAgent**: Seguridad y validación

## Mejores Prácticas
- Siempre ejecuta tests después de cambios (`npm test`)
- Prioriza seguridad: usa `textContent` en lugar de `innerHTML`
- Mantén responsive design y accesibilidad
- Documenta cambios en README.md
- Usa modo mock para desarrollo sin soporte de LanguageModel

## Flujo de Desarrollo
1. Analiza requerimiento con CoordinatorAgent
2. Implementa con agente especializado apropiado
3. Ejecuta tests con TestAgent
4. Revisa seguridad con SecurityAgent
5. Valida integración completa