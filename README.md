# AI Team Backend - Sistema Multiagente Orquestado

## Arquitectura
Backend Node.js/Express con orquestación dinámica de agentes basada en métricas emocionales.

## Agentes
- **Director**: Coordina y explica pasos
- **Analítico**: Valida y analiza técnicamente
- **Creativo**: Genera ideas alternativas
- **Controlador**: Valida factibilidad y riesgos

## Endpoints
- `POST /api/run-ticket` - Ejecuta pipeline completo
- `GET /api/session/:ticketId` - Obtiene traza completa
- `POST /api/test-compare` - Compara dos modos de ejecución
- `GET /api/health` - Health check

## Modos de Operación
- **simulated**: Respuestas deterministas (para testing)
- **hybrid**: Algunos agentes reales, otros simulados
- **real**: Todos los agentes con llamadas reales a Gemini

## Despliegue
1. Copiar `.env.example` a `.env` y configurar variables
2. `npm install`
3. `npm start`
