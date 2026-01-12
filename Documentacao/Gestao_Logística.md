# AURORA ERP

## Documento 4 — Gestão Logística

**Referência funcional:** SAP MM + WM + SD-Delivery / TOTVS SIGAEST + SIGALOJA

---

## 1. Objetivo do Módulo

Gerenciar **materiais, estoques, movimentações físicas e expedição**, garantindo:

* Rastreabilidade completa do material
* Aderência contábil automática
* Integração nativa com Comercial, Compras, Produção e Financeiro

Este módulo é **orientado a movimentos** e **controlado por regras**.

---

## 2. Princípios Logísticos

* Todo material é único e versionável
* Todo estoque pertence a um **Depósito + Local de Estoque**
* Toda movimentação gera **documento logístico**
* Todo movimento relevante gera **impacto contábil**
* Estoque nunca é alterado manualmente

---

## 3. Cadastro Central: Material

### 3.1 Identificação Geral

* ID interno
* Código do material
* Descrição curta
* Descrição longa
* Tipo de material (MP, PA, PI, MRO, Serviço)
* Status (ativo, bloqueado, descontinuado)

---

### 3.2 Dados Básicos

* Unidade de medida base
* Unidades alternativas (fator conversão)
* Peso bruto
* Peso líquido
* Volume
* Dimensões

---

### 3.3 Dados Logísticos

* Depósito padrão
* Local padrão
* Lead time
* Lote obrigatório (sim/não)
* Série obrigatória (sim/não)
* Validade controlada
* Política de picking (FIFO, FEFO)

---

### 3.4 Dados de Compras

* Fornecedor preferencial
* Lote mínimo
* Múltiplo de compra
* Prazo de entrega

---

### 3.5 Dados de Vendas

* Disponível para venda
* Unidade de venda
* Grupo de impostos
* Categoria comercial

---

### 3.6 Dados Contábeis

* Conta de estoque
* Conta de consumo
* Classe de avaliação
* Método de valorização (médio, FIFO)

---

### 3.7 Dados de Produção

* Produzido internamente (sim/não)
* Lista técnica vinculada
* Roteiro padrão

---

### 3.8 Regras de Negócio (Material)

* Código único por empresa
* Não pode ser excluído com estoque ou histórico
* Alterações críticas exigem versão

---

## 4. Estrutura de Estoque

### 4.1 Depósito

* Código
* Filial
* Tipo (MP, PA, MRO)
* Controle por lote
* Controle por série

---

### 4.2 Local de Estoque

* Código
* Depósito
* Permite picking
* Permite inventário

---

## 5. Documento Logístico: Entrada de Mercadoria

### 5.1 Origem

* Pedido de compra
* Nota fiscal
* Produção

### 5.2 Campos

* Empresa
* Filial
* Depósito
* Material
* Quantidade
* Lote / Série

### 5.3 Regras

* Atualiza estoque físico
* Gera documento contábil

---

## 6. Documento Logístico: Saída de Mercadoria

### 6.1 Origem

* Pedido de venda
* Consumo interno
* Produção

### 6.2 Validações

* Estoque disponível
* Lote válido
* Série válida

---

## 7. Transferências Internas

### 7.1 Tipos

* Entre locais
* Entre depósitos
* Entre filiais

### 7.2 Regras

* Pode gerar trânsito
* Pode exigir aprovação

---

## 8. Inventário Físico

### 8.1 Tipos

* Geral
* Parcial
* Rotativo

### 8.2 Processo

* Congelamento
* Contagem
* Ajuste

---

## 9. Reservas de Estoque

### 9.1 Origem

* Pedido de venda
* Ordem de produção

### 9.2 Regras

* Reserva bloqueia quantidade
* Não reduz saldo físico

---

## 10. Expedição (Delivery)

### 10.1 Documento de Entrega

* Pedido origem
* Cliente
* Itens
* Quantidades

### 10.2 Etapas

* Separação (picking)
* Conferência
* Embalagem
* Expedição

---

## 11. Picking & Packing

### 11.1 Picking

* Lista por rota
* Prioridade por data

### 11.2 Packing

* Volume
* Peso
* Embalagem

---

## 12. Rastreabilidade

* Lote
* Série
* Documento origem
* Documento destino

---

## 13. Integrações

* Comercial: pedidos e entregas
* Compras: recebimento
* Produção: consumo e entrada
* Financeiro: valorização

---

## 14. Eventos de Domínio

* MaterialCriado
* EstoqueReservado
* MovimentoEstoqueEfetuado
* InventarioConcluido

---

## 15. Transações (T-Codes)

* MM01 — Criar Material
* MIGO — Movimentar Estoque
* VL01 — Criar Entrega
* MI01 — Criar Inventário

---

## 16. Regras de Ouro

1. Sem estoque negativo
2. Sem movimento sem documento
3. Sem material fora do cadastro

---

**Este módulo sustenta toda a operação física do AURORA ERP.**
