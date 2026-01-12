# AURORA ERP

## Documento 10 — Contabilidade Gerencial & Custos (CO)

**Referência funcional:** SAP CO (CCA, PCA, IO, ML) / TOTVS SIGACTB Gerencial

---

## 1. Objetivo do Módulo

Fornecer **visão econômica real do negócio**, apurando custos, margens e rentabilidade por produto, processo, cliente e período, com integração total aos módulos operacionais e financeiros.

Este módulo **não substitui a contabilidade legal (FI)**; ele a complementa com visão gerencial.

---

## 2. Princípios de Custeio

* Todo custo nasce de um **evento operacional**
* Custos são apropriados por **objeto de custo**
* Rateios são **regrados e rastreáveis**
* Resultado gerencial pode divergir do legal
* Fechamento gerencial é controlado por período

---

## 3. Objetos de Custo (Master Data)

### 3.1 Centro de Custo (CCA)

**Finalidade:** concentrar custos indiretos.

**Campos:**

* Código
* Descrição
* Empresa / Filial
* Responsável
* Tipo (produtivo, administrativo, comercial)
* Conta padrão
* Vigência

---

### 3.2 Centro de Lucro (PCA)

**Finalidade:** apurar resultado por unidade de negócio.

**Campos:**

* Código
* Descrição
* Hierarquia
* Responsável
* Moeda

---

### 3.3 Ordem Interna (IO)

**Finalidade:** controlar custos temporários.

**Exemplos:** projetos, campanhas, manutenções.

**Campos:**

* Código
* Tipo
* Centro responsável
* Orçamento
* Status

---

### 3.4 Objeto Produto

* Material
* Família
* Linha
* Unidade de medida

---

## 4. Elementos de Custo

### 4.1 Primários

* Derivados da contabilidade (salários, energia)

### 4.2 Secundários

* Usados em rateios e transferências internas

---

## 5. Métodos de Custeio

* Custeio por absorção
* Custeio variável
* Custeio padrão
* Custeio real

Configuração por empresa.

---

## 6. Rateios e Distribuições

### 6.1 Tipos

* Rateio por percentual
* Rateio por base de alocação
* Rateio estatístico

### 6.2 Bases

* Horas
* Quantidade produzida
* Receita

---

## 7. Custo de Produção

### 7.1 Componentes

* Matéria-prima
* Mão de obra direta
* Custos indiretos (CIF)

### 7.2 Integração

* BOM
* Roteiro
* Ordens de produção

---

## 8. Apuração de Custos

### 8.1 Ciclo Mensal

1. Coleta de custos
2. Rateios
3. Cálculo de custo real
4. Análise de desvios

---

## 9. Análise de Margem

* Margem por produto
* Margem por cliente
* Margem por canal

---

## 10. Resultado Gerencial

* DRE gerencial
* Comparativo real x padrão
* Orçado x realizado

---

## 11. Fechamento Gerencial

* Bloqueio de período
* Reprocessamento controlado
* Versionamento

---

## 12. Integração com FI

* Lançamentos automáticos
* Reconciliação CO x FI

---

## 13. Planejamento e Orçamento

* Orçamento por centro
* Controle de desvios

---

## 14. Auditoria Gerencial

* Rastreabilidade completa
* Drill-down até a origem

---

## 15. Transações (T-Codes)

* KS01 — Centro de custo
* KO01 — Ordem interna
* KSB1 — Relatório custos

---

## 16. Regras de Ouro

1. Sem objeto de custo não há apropriação
2. Rateio sempre rastreável
3. Fechamento é definitivo

---

**Este módulo fornece a verdade econômica do AURORA ERP.**
