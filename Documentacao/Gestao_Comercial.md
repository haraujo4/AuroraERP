# AURORA ERP

## Documento 3 — Gestão Comercial (CRM + Vendas)

**Referência funcional: SAP SD + SAP CRM / TOTVS Protheus SIGACRM + SIGAVEN**

---

## 1. Objetivo do Módulo

Gerenciar **todo o ciclo comercial**, desde a prospecção até a geração de receita, garantindo:

* Rastreabilidade ponta a ponta
* Governança comercial
* Integração nativa com Logística, Financeiro e Fiscal

Este módulo é **dirigido por documentos**, não por telas.

---

## 2. Princípios do Módulo Comercial

* Cliente único (Parceiro de Negócio)
* Processo evolutivo: Lead → Oportunidade → Cotação → Pedido → Faturamento
* Preço sempre derivado de regras
* Crédito sempre validado
* Imposto sempre calculado

---

## 3. Cadastro Central: Parceiro de Negócio (BP)

### 3.1 Conceito

Entidade única que representa **Clientes, Prospectos, Fornecedores e Contatos**, eliminando duplicidade.

---

### 3.2 Dados Gerais

#### Identificação

* ID interno
* Tipo (Pessoa Física / Jurídica)
* Razão social / Nome
* Nome fantasia
* Status
* Data de criação

#### Documentos

* CPF / CNPJ
* RG / IE / IM
* Órgão emissor
* Validade

---

### 3.3 Endereços (Múltiplos)

* Tipo (fiscal, entrega, cobrança)
* Logradouro
* Número
* Complemento
* Bairro
* Cidade
* Estado
* País
* CEP
* Principal (sim/não)

---

### 3.4 Contatos

* Nome
* Cargo
* Departamento
* Telefone
* E-mail
* Preferência de contato

---

### 3.5 Dados Comerciais

* Vendedor padrão
* Região de vendas
* Condição de pagamento
* Incoterms
* Canal de distribuição
* Lista de preços
* Moeda padrão

---

### 3.6 Dados Financeiros

* Limite de crédito
* Exposição atual
* Bloqueio financeiro
* Conta contábil cliente
* Centro de lucro padrão

---

### 3.7 Dados Fiscais

* Regime tributário
* Classificação fiscal
* Isenções
* Benefícios fiscais

---

### 3.8 Regras de Negócio (BP)

* CPF/CNPJ único por empresa
* Bloqueio financeiro impede pedidos
* Exclusão proibida com histórico

---

## 4. CRM — Leads

### 4.1 Conceito

Registro inicial de interesse comercial.

### 4.2 Campos

* Origem
* Campanha
* Produto de interesse
* Probabilidade
* Responsável
* Status

### 4.3 Regras

* Lead pode ser convertido uma única vez

---

## 5. CRM — Oportunidades

### 5.1 Campos

* Cliente potencial
* Valor estimado
* Data prevista
* Probabilidade
* Etapa

### 5.2 Pipeline

* Prospecção
* Qualificação
* Proposta
* Negociação
* Fechamento

---

## 6. Documento: Cotação de Venda

### 6.1 Cabeçalho

* Empresa
* Filial
* Cliente
* Validade
* Condição de pagamento

### 6.2 Itens

* Produto
* Quantidade
* Preço base
* Descontos
* Impostos

### 6.3 Regras

* Cotação não reserva estoque
* Pode gerar pedido

---

## 7. Documento: Pedido de Venda

### 7.1 Cabeçalho

* Empresa
* Filial
* Cliente
* Tipo de pedido
* Data

### 7.2 Itens

* Produto
* Quantidade
* Depósito
* Data de entrega

### 7.3 Validações Obrigatórias

* Crédito
* Preço
* Estoque
* Fiscal

---

## 8. Contratos Comerciais

### 8.1 Finalidade

Pedidos recorrentes ou acordos de longo prazo.

### 8.2 Campos

* Vigência
* Volume contratado
* Preços negociados

---

## 9. Regras de Preço

### 9.1 Componentes

* Preço base
* Acréscimos
* Descontos
* Impostos

### 9.2 Hierarquia

Produto > Cliente > Canal > Região

---

## 10. Crédito e Risco

* Limite global
* Limite por empresa
* Bloqueio automático

---

## 11. Integrações

* Logística: reserva e expedição
* Financeiro: títulos a receber
* Fiscal: cálculo tributário

---

## 12. Eventos de Domínio

* LeadConvertido
* PedidoCriado
* PedidoBloqueadoCredito
* PedidoLiberado

---

## 13. Transações (T-Codes)

* BP01 — Criar Parceiro de Negócio
* CRM01 — Criar Lead
* CRM02 — Criar Oportunidade
* VA01 — Criar Pedido de Venda

---

## 14. Regras de Ouro

1. Sem preço manual fora da regra
2. Sem pedido sem crédito
3. Sem cliente sem BP

---

**Este módulo define a geração de receita do AURORA ERP.**
