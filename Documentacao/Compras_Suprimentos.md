# AURORA ERP

## Documento 7 — Compras & Suprimentos

**Referência funcional:** SAP MM-PUR / SRM / TOTVS SIGACOM

---

## 1. Objetivo do Módulo

Gerenciar **todo o ciclo de suprimentos**, desde a requisição até o pagamento do fornecedor, garantindo:

* Abastecimento contínuo
* Governança de compras
* Compliance com políticas internas
* Integração total com Logística, Financeiro e Produção

Este módulo é **dirigido por requisições e contratos**.

---

## 2. Princípios de Compras

* Compra sempre nasce de uma **necessidade formal**
* Preço é resultado de negociação ou contrato
* Recebimento sempre gera impacto físico e financeiro
* Fornecedor único (BP)
* Segregação entre solicitante, aprovador e comprador

---

## 3. Cadastro Central: Fornecedor (BP)

### 3.1 Conceito

Fornecedor é um **Parceiro de Negócio** com papel de suprimentos.

### 3.2 Dados Específicos de Compras

* Grupo de fornecedores
* Comprador responsável
* Condição de pagamento padrão
* Incoterms
* Moeda padrão
* Lead time médio

### 3.3 Dados Financeiros

* Conta contábil fornecedor
* Retenções aplicáveis
* Bloqueio para compras

---

## 4. Cadastro: Info Record (Fornecedor x Material)

### 4.1 Finalidade

Registrar histórico e condições específicas por fornecedor/material.

### 4.2 Campos

* Fornecedor
* Material
* Preço negociado
* Moeda
* Unidade
* Lead time
* Lote mínimo
* Validade

---

## 5. Requisição de Compra (RC)

### 5.1 Origem

* MRP
* Solicitação manual
* Ordem de produção

### 5.2 Campos

* Empresa
* Filial
* Material ou serviço
* Quantidade
* Data necessária
* Centro de custo

### 5.3 Regras

* RC não gera impacto financeiro
* RC pode ser consolidada

---

## 6. Processo de Cotação (RFQ)

### 6.1 Finalidade

Comparar preços e condições entre fornecedores.

### 6.2 Campos

* Fornecedores convidados
* Itens
* Prazo de resposta

### 6.3 Avaliação

* Preço
* Prazo
* Qualidade

---

## 7. Pedido de Compra (PO)

### 7.1 Cabeçalho

* Empresa
* Filial
* Fornecedor
* Condição de pagamento
* Moeda

### 7.2 Itens

* Material/Serviço
* Quantidade
* Preço
* Centro de custo
* Depósito

### 7.3 Regras

* Pedido aprovado é compromisso financeiro
* Alterações geram nova versão

---

## 8. Contratos de Compra

### 8.1 Tipos

* Contrato por valor
* Contrato por quantidade

### 8.2 Campos

* Vigência
* Limites
* Preços acordados

---

## 9. Aprovações (Workflow)

### 9.1 Critérios

* Valor
* Tipo de material
* Centro de custo

### 9.2 Regras

* Aprovação obrigatória antes do envio

---

## 10. Recebimento de Mercadoria

### 10.1 Origem

* Pedido de compra

### 10.2 Efeitos

* Entrada de estoque
* Documento financeiro provisório

---

## 11. Nota Fiscal de Entrada

### 11.1 Campos

* Número
* Série
* Impostos
* Chave

### 11.2 Integração

* Logística
* Financeiro
* Fiscal

---

## 12. Integração Financeira

* Geração de títulos a pagar
* Lançamentos contábeis automáticos

---

## 13. Avaliação de Fornecedores

### 13.1 Critérios

* Preço
* Prazo
* Qualidade
* Conformidade fiscal

---

## 14. Eventos de Domínio

* RequisicaoCriada
* PedidoCompraCriado
* RecebimentoEfetuado
* FornecedorAvaliado

---

## 15. Transações (T-Codes)

* ME51N — Criar Requisição
* ME21N — Criar Pedido Compra
* ME41 — Criar Cotação
* MIGO — Recebimento

---

## 16. Regras de Ouro

1. Sem RC não há compra
2. Sem PO não há recebimento
3. Sem recebimento não há pagamento

---

**Este módulo garante o abastecimento controlado do AURORA ERP.**
