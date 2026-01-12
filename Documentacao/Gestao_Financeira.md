# AURORA ERP

## Documento 5 — Gestão Financeira

**Referência funcional:** SAP FI (GL, AR, AP, BL) / TOTVS SIGAFIN

---

## 1. Objetivo do Módulo

Gerenciar **todas as movimentações financeiras e contábeis** da empresa, garantindo:

* Integridade contábil
* Rastreabilidade financeira completa
* Conciliação automática entre módulos
* Base sólida para fechamento e auditoria

Este módulo é o **centro nervoso do ERP**.

---

## 2. Princípios Financeiros

* Todo evento econômico gera lançamento contábil
* Nenhum lançamento ocorre sem documento origem
* Contabilidade integrada, não paralela
* Regime de competência como padrão
* Caixa nunca fica negativo

---

## 3. Plano de Contas (GL)

### 3.1 Estrutura

* Código da conta
* Descrição
* Tipo (Ativo, Passivo, Receita, Despesa, Resultado)
* Nível hierárquico
* Conta sintética / analítica
* Empresa

### 3.2 Configurações

* Permite lançamentos
* Moeda
* Conta conciliável
* Conta de controle (clientes/fornecedores)

### 3.3 Regras

* Só contas analíticas recebem lançamentos
* Exclusão proibida com histórico

---

## 4. Contas a Receber (AR)

### 4.1 Origem

* Faturamento de vendas
* Lançamentos manuais autorizados

### 4.2 Título a Receber — Campos

* Cliente (BP)
* Documento origem
* Data de emissão
* Data de vencimento
* Valor bruto
* Descontos
* Juros
* Multa
* Saldo
* Status

### 4.3 Regras

* Título nasce aberto
* Pagamento parcial permitido
* Bloqueio automático por atraso

---

## 5. Contas a Pagar (AP)

### 5.1 Origem

* Compras
* Serviços
* Despesas

### 5.2 Título a Pagar — Campos

* Fornecedor (BP)
* Documento origem
* Competência
* Vencimento
* Valor
* Impostos retidos
* Saldo
* Status

---

## 6. Caixa

### 6.1 Conceito

Controle de numerário físico.

### 6.2 Campos

* Caixa
* Empresa
* Filial
* Saldo inicial
* Responsável

### 6.3 Regras

* Abertura e fechamento diário
* Conferência obrigatória

---

## 7. Bancos

### 7.1 Cadastro Bancário

* Banco
* Agência
* Conta
* Tipo
* Moeda

### 7.2 Movimentações

* Pagamentos
* Recebimentos
* Transferências

---

## 8. Conciliação Bancária

### 8.1 Processo

* Importação extrato
* Matching automático
* Ajustes manuais

---

## 9. Fluxo de Caixa

### 9.1 Visões

* Realizado
* Previsto
* Projetado

### 9.2 Origem

* AR
* AP
* Contratos

---

## 10. Lançamentos Contábeis

### 10.1 Tipos

* Automáticos (integração)
* Manuais (autorizados)

### 10.2 Estrutura

* Débito
* Crédito
* Conta
* Centro de custo
* Centro de lucro

---

## 11. Integração Contábil Automática

### 11.1 Origem

* Logística (estoque)
* Comercial (faturamento)
* Compras
* Produção

### 11.2 Regra

* Mapeamento por tipo de movimento

---

## 12. Fechamento Financeiro

### 12.1 Processo

* Conferência
* Conciliações
* Bloqueio período
* Apuração resultado

---

## 13. Auditoria e Compliance

* Log de lançamentos
* Histórico de alterações
* Usuário e data

---

## 14. Eventos de Domínio

* TituloCriado
* PagamentoEfetuado
* ConciliacaoConcluida
* PeriodoFinanceiroFechado

---

## 15. Transações (T-Codes)

* FB01 — Lançamento Contábil
* F-28 — Recebimento Cliente
* F-53 — Pagamento Fornecedor
* FF67 — Conciliação Bancária

---

## 16. Regras de Ouro

1. Sem lançamento sem documento
2. Sem conta sem plano
3. Sem período aberto indevidamente

---

**Este módulo garante a integridade financeira do AURORA ERP.**
