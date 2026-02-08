# AuroraERP

O AuroraERP é um sistema completo de Planejamento de Recursos Empresariais (ERP) projetado para gerenciar processos de negócios essenciais. Ele possui um frontend moderno e responsivo construído com React e um backend robusto e escalável alimentado por .NET 8.

## 🚀 Stack Tecnológico

### Backend
- **Framework**: .NET 8 (C#)
- **Arquitetura**: Clean Architecture (Domínio, Aplicação, Infraestrutura, API)
- **Banco de Dados**: PostgreSQL
- **ORM**: Entity Framework Core
- **Autenticação**: JWT (JSON Web Tokens)
- **Armazenamento de Arquivos**: MinIO (Compatível com S3)
- **Documentação**: Swagger / OpenAPI
- **Email**: Integração SMTP / IMAP

### Frontend
- **Framework**: React 19
- **Ferramenta de Build**: Vite
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS
- **Gerenciamento de Estado**: React Hooks / Context
- **Cliente HTTP**: Axios

### Infraestrutura
- **Containerização**: Docker & Docker Compose
- **Gateway**: Caddy (Reverse Proxy)
- **Gerenciamento de Banco**: pgAdmin 4

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)
- [PostgreSQL](https://www.postgresql.org/) (Desenvolvimento local apenas se não usar Docker)

## 📦 Instalação e Configuração

### Opção 1: Docker (Recomendado para Início Rápido)

Execute toda a stack da aplicação (Banco de Dados, Backend, Frontend, MinIO, Gateway) com um único comando:

```bash
docker-compose up --build -d
```

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Swagger UI**: http://localhost/swagger (se exposto) ou via porta direta do backend
- **pgAdmin**: http://localhost:5050
- **Console MinIO**: http://localhost:9001

### Opção 2: Desenvolvimento Local

#### 1. Configuração do Banco de Dados
Certifique-se de que o PostgreSQL esteja em execução. Atualize a string de conexão em `backend/Aurora.API/appsettings.Development.json` se necessário.

#### 2. Configuração do Backend
Navegue até o diretório do backend e inicie a API:

```bash
cd backend/Aurora.API
dotnet restore
dotnet run
```
A API iniciará em `http://localhost:5283`.
- **Swagger UI**: http://localhost:5283/swagger

#### 3. Configuração do Frontend
Navegue até o diretório do frontend, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend
npm install
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`.

## 🔑 Autenticação

**Credenciais Padrão de Admin:**
- **Email**: `admin@aurora.com`
- **Senha**: `admin123`

## 📂 Estrutura do Projeto

```
AuroraERP/
├── backend/                # Solução .NET 8
│   ├── Aurora.API/         # Controladores da API e Ponto de Entrada
│   ├── Aurora.Application/ # Regras de Negócio e Interfaces
│   ├── Aurora.Domain/      # Entidades e Lógica Central
│   └── Aurora.Infrastructure/ # Banco de Dados e Serviços Externos
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes de UI Reutilizáveis
│   │   ├── pages/          # Páginas da Aplicação
│   │   └── services/       # Integração com API
├── gateway/                # Configuração do Caddy/Nginx
├── docker-compose.yml      # Orquestração de Containers
└── Documentacao/           # Ativos de Documentação do Projeto
```

## 🧪 Executando Testes

Para executar testes unitários do backend:
```bash
cd backend
dotnet test
```

## 📝 Licença

Este projeto é software proprietário.
