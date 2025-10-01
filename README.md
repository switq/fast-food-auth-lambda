# 🔐 Fast Food Auth Lambda - Fase 3

## 📋 Descrição
Função AWS Lambda responsável por autenticar clientes via CPF usando AWS Cognito e emitir tokens JWT para o sistema Fast Food.

## 🎯 Objetivo da Fase 3
- Implementar autenticação serverless via Lambda
- Integração com AWS Cognito para identificação de clientes
- Emissão de tokens JWT sem necessidade de senha
- Deploy automatizado via CI/CD

## 🏗️ Arquitetura
```
API Gateway → Lambda → AWS Cognito → JWT Token
```

## 🚀 Funcionalidades
- **Autenticação por CPF**: Sem necessidade de senha
- **Integração Cognito**: Sistema de autenticação AWS
- **JWT Tokens**: Emissão segura de tokens
- **Validação CPF**: Validação de formato e dígitos verificadores
  - módulos esperados para autenticação:
    - cognito/ (se for usado) — criação de User Pool, clients, triggers
    - lambda/ — definição de aws_lambda_function, role, policies
    - api_gateway/ — HTTP API + integrações
    - secrets/ — Secrets Manager (JWT secret, etc.)
    - iam/ — policies e roles minimamente permissivas
  - responsabilidades: codificar infraestrutura de forma declarativa (Terraform), armazenar state remoto (S3 + DynamoDB locking), usar workspaces por ambiente.

Princípios e restrições (aplicáveis ao módulo Lambda)
- Clean Architecture: separar responsabilidades. Handlers (presentation) não devem conter lógica de negócio; use-cases (application) fazem orquestração; domain contém contratos e entidades; infra implementa contratos.
- Dependência inversa: fluxo presentation -> application -> domain. Nunca importar infrastructure dentro de application/domain.
- Secrets: nunca commitar segredos. JWT secret e chaves devem ficar em AWS Secrets Manager e acessadas pela Lambda via IAM com permissões restritas.
- CI/CD: Infra (Terraform) e código da Lambda devem ter pipelines separados. Usar GitHub OIDC para credenciais AWS sempre que possível.

Boas práticas recomendadas
- Injeção de dependências: construir instâncias concretas na borda (API / bootstrap / infra) e passar para handlers/use-cases.
- Testes: cobertura mínima para validators, services e use-cases; mocks para dependências infra.
- Observabilidade: enviar logs para CloudWatch; configurar métricas e alarmes básicos (Failures, Duration).
- Local development: suportar execução com LocalStack ou SAM para testar integrações sem custo AWS.

## 📁 Estrutura do Projeto

```
src/
├── handlers/
│   ├── identifyHandler.ts     # Handler principal da Lambda
│   ├── createAuthChallenge.ts # Criação de desafios Cognito
│   ├── defineAuthChallenge.ts # Definição de fluxo de auth
│   └── verifyAuthChallenge.ts # Verificação de desafios
├── services/
│   ├── cpfValidator.ts        # Validação de CPF
│   └── jwtService.ts          # Geração de JWT
└── __tests__/                 # Testes unitários
```

## 🔧 Scripts Disponíveis

```bash
npm run build        # Compilar TypeScript
npm run test         # Executar testes
npm run lint         # Verificar código
npm run package      # Criar pacote para deploy
```

## 🚀 Deploy Automático

O deploy é automático via GitHub Actions quando há push na branch `main`:

1. **Test**: Executa testes unitários
2. **Build**: Compila TypeScript
3. **Package**: Cria zip de deploy
4. **Deploy**: Atualiza função Lambda na AWS

## 🔐 Secrets Necessários

Configure no GitHub Repository Settings > Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `JWT_SECRET`

## 📊 Fluxo de Autenticação

1. Cliente envia CPF via API Gateway
2. Lambda valida formato do CPF
3. Consulta/Cria usuário no Cognito
4. Gera token JWT
5. Retorna token para o cliente

## 🎯 Entregável Fase 3

✅ Repositório separado para Lambda
✅ CI/CD automatizado
✅ Integração com AWS Cognito
✅ Autenticação sem senha
✅ Branch protection configurada

Próximos passos (prioritários para entregar Parte 5)
1. Criar/confirmar interface em `fast-food-api/src/domain` para autenticação (ex: `CustomerAuthGateway` ou `CustomerRepository`) e commitá-la.
2. Refatorar/garantir que `fast-food-auth-lambda` dependa apenas de serviços e interfaces (injetáveis) e que possua testes unitários.
3. Criar módulo Terraform mínimo em `infra/` (ou repositório `infra-lambda`) para SecretsManager, Lambda (role mínimo), API Gateway e outputs.
4. Implementar leitura segura do JWT secret da Lambda via Secrets Manager (AWS SDK v3) e garantir IAM role com GetSecretValue.
5. Criar GitHub Actions: CI (lint/test/build) e infra-plan (terraform fmt/validate/plan) em PRs; infra-apply em main com revisão.

Arquivos chave (onde começar)
- fast-food-auth-lambda/src/handlers/identifyHandler.ts
- fast-food-auth-lambda/src/services/jwtService.ts
- fast-food-auth-lambda/__tests__/identifyHandler.test.ts
- infra/ (ou novo repo `infra-lambda`) Terraform modules: lambda, api_gateway, secrets, iam

Contato rápido
- Se quiser, gero agora:
  - A) README de módulo Terraform minimal (main.tf, variables, outputs)
  - B) Alteração no handler `identifyHandler.ts` para ler Secrets Manager (AWS SDK v3)
  - C) Template GitHub Actions (CI + terraform plan)
