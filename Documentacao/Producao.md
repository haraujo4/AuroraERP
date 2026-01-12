# AURORA ERP

## Documento 6 — Produção / PCP

**Referência funcional:** SAP PP + CO-PC / TOTVS SIGAPCP + SIGACUSTO

---

## 1. Objetivo do Módulo

Gerenciar **planejamento, execução e controle da produção**, garantindo:

* Conversão correta de demanda em produção
* Consumo real de materiais
* Apontamento preciso de tempos e quantidades
* Apuração confiável de custos industriais

Este módulo fecha o ciclo **Logística → Produção → Financeiro**.

---

## 2. Princípios da Produção

* Produção sempre nasce de demanda
* Nenhuma ordem sem lista técnica válida
* Nenhum consumo sem apontamento
* Custos industriais apurados por evento
* Estoque em processo é rastreável

---

## 3. Cadastro Central: Lista Técnica (BOM)

### 3.1 Identificação

* Código da BOM
* Material pai (produto acabado ou semiacabado)
* Versão
* Status
* Vigência início/fim

### 3.2 Componentes

Para cada componente:

* Material componente
* Quantidade padrão
* Unidade
* Fator de perda
* Depósito de consumo
* Item alternativo (substituição)

### 3.3 Regras

* BOM ativa é única por período
* Alterações geram nova versão

---

## 4. Cadastro Central: Roteiro de Produção

### 4.1 Identificação

* Código do roteiro
* Material
* Versão
* Centro de trabalho principal

### 4.2 Operações

Para cada operação:

* Sequência
* Centro de trabalho
* Tempo setup
* Tempo máquina
* Tempo mão de obra
* Capacidade
* Custo hora

---

## 5. Cadastro: Centro de Trabalho

### 5.1 Campos

* Código
* Descrição
* Tipo (máquina, linha, manual)
* Capacidade diária
* Turnos
* Centro de custo vinculado

---

## 6. Planejamento de Produção (MRP)

### 6.1 Entradas

* Pedidos de venda
* Previsões de demanda
* Estoque disponível
* Lead time

### 6.2 Saídas

* Ordens planejadas
* Requisições de compra
* Sugestões de produção

---

## 7. Ordem de Produção

### 7.1 Cabeçalho

* Número da ordem
* Material produzido
* Quantidade planejada
* Data início/fim
* Depósito de entrada

### 7.2 Componentes

* Material
* Quantidade planejada
* Quantidade consumida

---

## 8. Apontamentos de Produção

### 8.1 Tipos

* Apontamento de consumo
* Apontamento de produção
* Apontamento de tempo

### 8.2 Regras

* Consumo reduz estoque
* Produção gera estoque
* Tempo gera custo

---

## 9. Custos Industriais

### 9.1 Componentes de Custo

* Matéria-prima
* Mão de obra
* Overhead

### 9.2 Apuração

* Por ordem
* Por produto
* Por período

---

## 10. Estoque em Processo (WIP)

### 10.1 Conceito

Controle de materiais parcialmente processados.

### 10.2 Regras

* WIP é valorizado
* Transferência automática na conclusão

---

## 11. Integrações

* Logística: consumo e entrada
* Compras: requisições
* Financeiro: custos e lançamentos
* Comercial: atendimento de demanda

---

## 12. Eventos de Domínio

* OrdemCriada
* ConsumoApontado
* ProducaoApontada
* OrdemEncerrada

---

## 13. Transações (T-Codes)

* CS01 — Criar Lista Técnica
* CA01 — Criar Roteiro
* CO01 — Criar Ordem Produção
* MFBF — Apontamento Produção

---

## 14. Regras de Ouro

1. Sem BOM válida não há produção
2. Sem apontamento não há custo
3. Sem encerramento não há resultado

---

**Este módulo fecha o ciclo industrial do AURORA ERP.**
