# Script para deploy da Lambda com dependências
param(
    [string]$Environment = "dev"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy da Lambda function..." -ForegroundColor Green

# Limpar e criar diretório de deploy
$deployDir = "deploy"
$lambdaPackage = "fast-food-auth-lambda.zip"

if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir

# Build do projeto
Write-Host "📦 Compilando TypeScript..." -ForegroundColor Yellow
npm run build

# Copiar arquivos compilados
Write-Host "📋 Copiando arquivos compilados..." -ForegroundColor Yellow
Copy-Item -Path "dist\*" -Destination $deployDir -Recurse

# Copiar package.json de produção
Write-Host "📦 Copiando package.json de produção..." -ForegroundColor Yellow
Copy-Item -Path "package.prod.json" -Destination "$deployDir\package.json"

# Instalar dependências de produção
Write-Host "⬇️ Instalando dependências de produção..." -ForegroundColor Yellow
Push-Location $deployDir
npm install --only=production
Pop-Location

# Criar ZIP para Lambda
Write-Host "🗜️ Criando pacote ZIP..." -ForegroundColor Yellow
$zipPath = "$deployDir\$lambdaPackage"
if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

# Criar ZIP com todos os arquivos do deploy directory
Push-Location $deployDir
Compress-Archive -Path "*" -DestinationPath $lambdaPackage
Pop-Location

# Aplicar via Terraform
Write-Host "🔧 Aplicando via Terraform..." -ForegroundColor Yellow
Push-Location "..\infra"
terraform apply -var-file="$Environment.tfvars" -auto-approve
Pop-Location

Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "📍 Pacote Lambda criado em: $deployDir\$lambdaPackage" -ForegroundColor Cyan
