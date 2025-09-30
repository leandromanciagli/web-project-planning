# Test script para verificar el endpoint del API
# Este script simula la llamada que hace el frontend con estructura completa

Write-Host "Testing API endpoint with complete task structure..." -ForegroundColor Green
Write-Host "URL: http://localhost:5001/api/v1/projects/" -ForegroundColor Yellow
Write-Host ""

# Datos de prueba completos que coinciden con el formulario actualizado
$body = @{
    name = "Clean Water Access Initiative"
    description = "Multi-phase project to provide clean water access to rural communities in developing regions through sustainable infrastructure development, community education, and long-term maintenance programs."
    startDate = "2025-10-01"
    endDate = "2026-09-30"
    ownerId = 2
    tasks = @(
        @{
            title = "Community Assessment and Needs Analysis"
            description = "Conduct comprehensive assessment of target communities including water source analysis, population demographics, current infrastructure evaluation, and identification of key stakeholders."
            priority = "high"
            dueDate = "2025-11-15"
            estimatedHours = 120
            status = "todo"
        },
        @{
            title = "Environmental Impact Study"
            description = "Perform detailed environmental impact assessment including soil analysis, water quality testing, ecosystem evaluation, and development of mitigation strategies for minimal environmental disruption."
            priority = "high"
            dueDate = "2025-12-01"
            estimatedHours = 80
            status = "todo"
        },
        @{
            title = "Technical Design and Engineering Plans"
            description = "Develop comprehensive technical specifications for water infrastructure including well drilling plans, pump systems design, distribution networks, and storage solutions."
            priority = "high"
            dueDate = "2026-01-31"
            estimatedHours = 200
            status = "todo"
        }
    )
} | ConvertTo-Json -Depth 4

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/v1/projects/" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Respuesta del servidor:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 4) -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Error al conectar con el API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Asegúrate de que el backend esté ejecutándose en http://localhost:5001" -ForegroundColor Yellow
}