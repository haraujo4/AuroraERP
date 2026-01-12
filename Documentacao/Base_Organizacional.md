# AURORA ERP

## Documento 2 — Base Organizacional

**Modelo Empresarial Atômico (Referência SAP / TOTVS)**

---

## 1. Objetivo do Módulo

Definir a **estrutura organizacional completa** que sustenta todos os módulos do AURORA ERP.

Este módulo é **obrigatório, transversal e imutável por processo**: nenhum documento, lançamento ou transação pode existir fora desta base.

---

## 2. Princípios Estruturais

* Toda operação pertence a uma **Empresa**
* Toda execução ocorre em uma **Filial**
* Toda contabilização exige **Centro de Custo ou Centro de Lucro**
* Toda movimentação física exige **Depósito e Local de Estoque**
* Toda consolidação respeita hierarquia organizacional

---

## 3. Entidade: Grupo Empresarial

### 3.1 Finalidade

Permitir consolidação financeira, fiscal e gerencial entre empresas.

### 3.2 Campos Atômicos

* ID interno
* Código do grupo
* Razão social consolidada
* Nome fantasia
* País de consolidação
* Moeda base
* Idioma padrão
* Regime fiscal consolidado
* Data de criação
* Status (ativo/inativo)

### 3.3 Regras de Negócio

* Um grupo possui **1 ou mais empresas**
* Moeda base não pode ser alterada após movimentação

---

## 4. Entidade: Empresa (Company Code)

### 4.1 Finalidade

Entidade legal e contábil.

### 4.2 Dados Legais

* ID interno
* Código da empresa
* Razão social
* Nome fantasia
* CNPJ / Tax ID
* Inscrição estadual
* Inscrição municipal
* CNAE principal
* Natureza jurídica
* Regime tributário

### 4.3 Endereço Fiscal

* País
* Estado
* Cidade
* CEP
* Logradouro
* Número
* Complemento

### 4.4 Configurações Financeiras

* Moeda local
* Plano de contas vinculado
* Calendário fiscal
* Método de avaliação cambial

### 4.5 Regras

* Uma empresa pertence a **um único grupo**
* Não pode ser excluída com lançamentos

---

## 5. Entidade: Filial (Branch / Plant)

### 5.1 Finalidade

Unidade operacional da empresa.

### 5.2 Campos

* ID interno
* Código da filial
* Descrição
* Empresa vinculada
* Endereço operacional
* Tipo (industrial, comercial, serviço)
* Status

### 5.3 Regras

* Toda transação ocorre em uma filial
* Pode possuir múltiplos depósitos

---

## 6. Entidade: Unidade de Negócio

### 6.1 Finalidade

Segmentação gerencial.

### 6.2 Campos

* Código
* Descrição
* Empresa
* Responsável
* Centro de lucro padrão

---

## 7. Entidade: Centro de Custo

### 7.1 Finalidade

Controle de despesas.

### 7.2 Campos

* Código
* Descrição
* Empresa
* Hierarquia pai
* Responsável
* Validade início/fim

### 7.3 Regras

* Obrigatório em despesas
* Estrutura hierárquica

---

## 8. Entidade: Centro de Lucro

### 8.1 Finalidade

Apuração de resultados.

### 8.2 Campos

* Código
* Descrição
* Empresa
* Unidade de negócio
* Responsável

---

## 9. Entidade: Depósito (Warehouse)

### 9.1 Finalidade

Controle físico de estoques.

### 9.2 Campos

* Código
* Descrição
* Filial
* Endereço físico
* Tipo (MP, PA, MRO)
* Controle de lotes
* Controle de série

---

## 10. Entidade: Local de Estoque

### 10.1 Finalidade

Subdivisão logística do depósito.

### 10.2 Campos

* Código
* Depósito
* Tipo
* Permite picking
* Permite inventário

---

## 11. Entidade: Calendário Fiscal

### 11.1 Campos

* Código
* Ano fiscal
* Períodos
* Datas de abertura/fechamento

### 11.2 Regras

* Período fechado bloqueia lançamentos

---

## 12. Entidade: Moeda

### 12.1 Campos

* Código ISO
* Descrição
* Casas decimais
* Símbolo

---

## 13. Entidade: Taxas de Câmbio

### 13.1 Campos

* Moeda origem
* Moeda destino
* Tipo de taxa
* Data validade
* Valor

---

## 14. Entidade: Usuário Organizacional

### 14.1 Campos

* Usuário
* Empresa(s) autorizada(s)
* Filial(is)
* Centro de custo
* Centro de lucro

---

## 15. Integrações com Módulos

* Comercial: empresa, filial, centro de lucro
* Logística: filial, depósito, local
* Financeiro: empresa, centro de custo, calendário
* Produção: filial, centro de custo, depósito

---

## 16. Eventos de Domínio

* EmpresaCriada
* FilialCriada
* CentroCustoAlterado
* PeriodoFiscalFechado

---

## 17. Regras de Ouro

1. Nenhum dado fora da base organizacional
2. Nenhuma exclusão com histórico
3. Toda hierarquia é auditável

---

**Este documento é a espinha dorsal do AURORA ERP.**
