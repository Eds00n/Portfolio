# Script para atualizar o PATH no PowerShell após instalação do Node.js
# Execute este script na sessão atual do PowerShell se os comandos node/npm/npx não funcionarem

Write-Host "Atualizando PATH do PowerShell..." -ForegroundColor Yellow

# Atualiza o PATH com as variáveis de ambiente do sistema e do usuário
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "PATH atualizado!" -ForegroundColor Green
Write-Host ""

# Verifica se os comandos estão funcionando
Write-Host "Verificando instalação:" -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  Node.js: NÃO ENCONTRADO" -ForegroundColor Red
}

try {
    $npmVersion = npm --version
    Write-Host "  npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  npm: NÃO ENCONTRADO" -ForegroundColor Red
}

try {
    $npxVersion = npx --version
    Write-Host "  npx: $npxVersion" -ForegroundColor Green
} catch {
    Write-Host "  npx: NÃO ENCONTRADO" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Pronto! Agora você pode usar: npm start, npx serve . etc." -ForegroundColor Green
