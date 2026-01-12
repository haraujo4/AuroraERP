# AURORA ERP

**Nome comercial:** **AURORA ERP**
**Tagline:** *Precisão industrial. Controle total.*

---

## 1. Objetivo do Produto

Construir um **ERP corporativo completo**, modular, escalável e extensível, alinhado aos padrões de mercado estabelecidos por **SAP (ECC/S4)** e **TOTVS (Protheus/Logix)**, com:

* Cobertura end‑to‑end dos processos empresariais
* Forte aderência a regras de negócio reais
* Navegação por **códigos de transação** (estilo SAP GUI)
* Interface **web responsiva**, mantendo **layout visual clássico do SAP GUI**
* Arquitetura moderna (React + Vite, C#/.NET, PostgreSQL)
* Orquestração integral via **Docker**

---

## 2. Princípios Fundamentais

### 2.1 Princípios de Negócio

* **Single Source of Truth (SSOT)** por domínio
* **Processos dirigidos por documentos** (pedido, nota, ordem, título, etc.)
* **Rastreabilidade total** (audit trail)
* **Segregação de funções (SoD)**
* **Configuração > Customização > Código**

### 2.2 Princípios Técnicos

* Arquitetura **modular por domínio (DDD)**
* **Event‑Driven** para integrações internas
* APIs REST + eventos assíncronos
* Versionamento de contratos
* Multi‑empresa, multi‑filial, multi‑moeda, multi‑idioma

---

## 3. Arquitetura Geral

### 3.1 Stack Tecnológica

**Frontend**

* React + Vite
* TailwindCSS
* State: Zustand / Redux Toolkit
* i18n

**Backend**

* .NET (C#)
* ASP.NET Core Web API
* MediatR (CQRS)
* FluentValidation

**Banco de Dados**

* PostgreSQL
* Schemas por domínio
* Migrações versionadas

**Infraestrutura**

* Docker / Docker Compose
* Nginx (gateway)
* Observabilidade (logs, métricas, tracing)

---

## 4. Organização Modular do ERP

Cada módulo será documentado **em documento próprio**, com:

* Escopo funcional
* Entidades (cadastros) em nível atômico
* Regras de negócio
* Fluxos operacionais
* Eventos gerados/consumidos
* Integrações internas

### 4.1 Módulos Core

1. **Base Organizacional**
2. **Segurança & Autorizações**
3. **Gestão Comercial (CRM + Vendas)**
4. **Gestão Logística**
5. **Gestão Financeira**
6. **Controladoria & Fiscal**
7. **Produção / PCP**
8. **Compras & Suprimentos**
9. **Ativos & Manutenção**
10. **RH & Pessoas**
11. **BI & Analytics**

---

## 5. Navegação por Transações (Estilo SAP)

### 5.1 Conceito

* Cada funcionalidade possui um **Transaction Code (T‑Code)**
* Exemplo:

  * `VA01` → Criar Pedido de Venda
  * `MM01` → Criar Material

### 5.2 Implementação

* Campo global de comando
* Autocomplete por:

  * Código
  * Nome
  * Descrição
* Histórico de transações
* Favoritos por usuário

---

## 6. Base Organizacional (Modelo Empresarial)

### 6.1 Entidades Estruturais

* Grupo Empresarial
* Empresa
* Filial
* Unidade de Negócio
* Centro de Custo
* Centro de Lucro
* Depósito
* Local de Estoque

### 6.2 Regras‑Chave

* Toda transação pertence a **Empresa + Filial**
* Financeiro e Logística podem divergir de estrutura
* Consolidação por níveis hierárquicos

---

## 7. Segurança & Governança

### 7.1 Autenticação

* JWT + Refresh Token
* SSO (futuro)

### 7.2 Autorização

* Perfis
* Papéis
* Autorizações por:

  * Transação
  * Campo
  * Empresa/Filial

### 7.3 Auditoria

* Log de dados mestres
* Log de documentos
* Log de acessos

---

## 8. Padrões de Desenvolvimento

### 8.1 Backend

* Controllers finos
* Handlers por caso de uso
* Regras no domínio

### 8.2 Frontend

* Componentização rigorosa
* Layout SAP‑like reutilizável
* Formulários dirigidos por metadados

---

## 9. Layout SAP GUI Classic (Referência)

### Elementos obrigatórios:

* Menu superior fixo
* Barra de comandos (T‑Code)
* Sidebar em árvore
* Área de conteúdo em grid
* Status bar inferior

---

## 10. Próximos Documentos

Os próximos documentos seguirão este padrão:

**Documento 1** – Style Guide (UI/UX)

**Documento 2** – Base Organizacional (Detalhamento Atômico)

**Documento 3** – Gestão Comercial (CRM + Vendas)

**Documento 4** – Logística

**Documento 5** – Financeiro

**Documento 6** – Produção / PCP

---

> **Este documento é a fundação do AURORA ERP. Nenhuma decisão de módulo pode violar estes princípios.**
