# AURORA ERP

## Documento 14 — Arquitetura Técnica & Infraestrutura

**Stack:** C# (.NET) · PostgreSQL · React + Vite · Docker
**Referência:** SAP S/4HANA Architecture · Clean Architecture · DDD

---

## 1. Objetivo do Documento

Definir a **arquitetura técnica oficial** do AURORA ERP, garantindo:

* Escalabilidade
* Manutenibilidade
* Segurança
* Separação clara de responsabilidades
* Evolução sem quebra de módulos

Este documento é **mandatório para desenvolvimento**.

---

## 2. Princípios Arquiteturais

1. Arquitetura orientada a domínio (DDD)
2. Separação total entre UI, aplicação e domínio
3. Banco de dados como detalhe de implementação
4. Eventos como mecanismo de integração
5. Infraestrutura declarativa (Docker)

---

## 3. Visão Geral da Arquitetura

```
[ Web (React) ]
        |
        v
[ API Gateway ]
        |
        v
[ Serviços de Aplicação (.NET) ]
        |
        v
[ Domínio + Regras de Negócio ]
        |
        v
[ PostgreSQL ]
```

---

## 4. Backend — Arquitetura .NET

### 4.1 Camadas

#### 4.1.1 Presentation

* Controllers REST
* DTOs
* Validação de entrada

#### 4.1.2 Application

* Use Cases
* Orquestração
* Transações

#### 4.1.3 Domain

* Entidades
* Aggregates
* Value Objects
* Domain Services
* Eventos de domínio

#### 4.1.4 Infrastructure

* Repositórios
* ORM (EF Core ou Dapper)
* Mensageria
* Integrações externas

---

## 5. Organização por Módulo

Cada módulo do ERP é um **Bounded Context**:

* Comercial
* Logística
* Compras
* Produção
* Financeiro
* Fiscal
* Custos
* Segurança

Cada contexto possui:

* API própria
* Banco lógico isolado
* Contratos explícitos

---

## 6. Banco de Dados — PostgreSQL

### 6.1 Estratégia

* Schema por módulo
* Chaves UUID
* Soft delete
* Auditoria nativa

### 6.2 Padrões

* Tabelas normalizadas
* Views para leitura
* Índices explícitos

---

## 7. Eventos e Integração Interna

### 7.1 Tipos

* Eventos de domínio
* Eventos de integração

### 7.2 Exemplos

* PedidoVendaCriado
* NotaFiscalEmitida
* OrdemProducaoEncerrada

---

## 8. Segurança Técnica

* JWT
* OAuth2
* Refresh Tokens
* Criptografia de dados sensíveis

---

## 9. Frontend — React + Vite

### 9.1 Estrutura

* Pages
* Components
* Hooks
* Services
* Store (estado global)

### 9.2 Comunicação

* REST
* Tratamento global de erros

---

## 10. Docker & Orquestração

### 10.1 Containers

* frontend
* api-gateway
* services
* postgres
* redis

### 10.2 Ambientes

* Dev
* Homologação
* Produção

---

## 11. Observabilidade

* Logs estruturados
* Métricas
* Tracing distribuído

---

## 12. Performance

* Cache Redis
* Paginação
* Queries otimizadas

---

## 13. Deploy

* CI/CD
* Migração automática
* Rollback seguro

---

## 14. Governança Técnica

* Versionamento de API
* Code review obrigatório
* Padrões de commit

---

## 15. Regras de Ouro

1. Regra de negócio nunca no controller
2. Domínio não depende de infraestrutura
3. Evento é contrato

---

**Este documento sustenta tecnicamente todo o AURORA ERP.**
