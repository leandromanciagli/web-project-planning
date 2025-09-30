#!/bin/bash

# Test script para verificar el endpoint del API
# Este script simula la llamada que hace el frontend

echo "Testing API endpoint..."
echo "URL: http://localhost:5001/api/v1/projects/"
echo ""

# Datos de prueba que coinciden con el formulario
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

echo ""
echo ""
echo "✅ Si el backend está funcionando, deberías ver una respuesta JSON arriba."
echo "❌ Si ves un error de conexión, asegúrate de que el backend esté ejecutándose en http://localhost:5001"