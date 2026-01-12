# AURORA ERP

## Documento 9 — Segurança, Perfis e Autorizações

**Referência funcional:** SAP GRC / SU01 / PFCG / TOTVS SIGASEG

---

## 1. Objetivo do Módulo

Garantir **controle absoluto de acesso**, segregação de funções (SoD), rastreabilidade e conformidade, assegurando que cada usuário execute **somente o que é autorizado**, dentro de regras corporativas e legais.

Este módulo é **transversal a todo o ERP**.

---

## 2. Princípios de Segurança Corporativa

* Segurança é definida por **papel**, não por usuário
* Nenhuma ação sem autorização explícita
* Segregação de funções obrigatória
* Auditoria completa e imutável
* Privilégios mínimos necessários (Least Privilege)

---

## 3. Identidade do Usuário

### 3.1 Cadastro de Usuário

* ID único
* Nome completo
* Email corporativo
* Status (ativo, bloqueado, expirado)
* Validade de acesso
* Idioma
* Fuso horário

### 3.2 Autenticação

* Usuário/senha
* MFA (opcional)
* Integração com LDAP / AD
* Token JWT (web)

---

## 4. Estrutura de Autorizações

### 4.1 Objeto de Autorização

Cada autorização é composta por:

* Objeto
* Ação
* Valor

Exemplo:

* OBJETO: PEDIDO_COMPRA
* AÇÃO: APROVAR
* VALOR: ATÉ 50.000

---

## 5. Perfis de Acesso (Roles)

### 5.1 Conceito

Perfil é um **conjunto de autorizações** reutilizável.

### 5.2 Tipos de Perfil

* Funcional (Comprador, Analista Fiscal)
* Técnico (Admin, Suporte)
* Temporário

---

## 6. Atribuição de Perfis

* Usuário pode ter múltiplos perfis
* Perfis podem ter validade
* Conflitos são validados automaticamente

---

## 7. Segregação de Funções (SoD)

### 7.1 Regras Clássicas

* Criar pedido x Aprovar pedido
* Criar fornecedor x Pagar fornecedor
* Emitir NF x Cancelar NF

### 7.2 Motor de Validação

* Bloqueio preventivo
* Log de tentativa

---

## 8. Segurança por Transação

* Acesso a telas
* Execução de funções
* Consulta x alteração

---

## 9. Segurança por Campo

* Leitura
* Escrita
* Ocultação

Exemplo:

* Campo preço unitário oculto para vendedor

---

## 10. Segurança por Organização

* Empresa
* Filial
* Centro

Usuário só enxerga estruturas autorizadas.

---

## 11. Workflow de Aprovação

### 11.1 Critérios

* Valor
* Tipo de documento
* Área

### 11.2 Regras

* Aprovação sequencial
* Aprovação paralela

---

## 12. Auditoria de Segurança

### 12.1 Eventos Auditados

* Login/logout
* Tentativa de acesso negado
* Alteração de perfil
* Execução crítica

---

## 13. Logs e Trilha de Auditoria

* Usuário
* Data/hora
* Ação
* Antes/depois

Logs são **imutáveis**.

---

## 14. Administração de Segurança

* Criação de perfis
* Simulação de acesso
* Análise de risco

---

## 15. Transações (T-Codes)

* SU01 — Usuários
* PFCG — Perfis
* GRAC — Risco

---

## 16. Regras de Ouro

1. Segurança vem antes da funcionalidade
2. Sem perfil não há acesso
3. Toda ação deixa rastro

---

**Este módulo torna o AURORA ERP auditável, escalável e corporativo.**
