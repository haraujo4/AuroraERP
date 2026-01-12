# AURORA ERP

## Documento 11 — BI, Relatórios e Analytics

**Referência funcional:** SAP BW/4HANA, SAP Analytics Cloud, TOTVS Analytics

---

## 1. Objetivo do Módulo

Disponibilizar **inteligência analítica corporativa**, permitindo acompanhamento operacional, financeiro e estratégico em tempo quase real, com **drill-down até a transação origem**, suportando tomada de decisão em todos os níveis da organização.

Este módulo **não altera dados operacionais**; ele consome dados consolidados e históricos.

---

## 2. Princípios de BI Corporativo

* Fonte única da verdade (Single Source of Truth)
* Dados operacionais separados de dados analíticos
* Histórico imutável
* Métricas padronizadas
* Performance prioritária

---

## 3. Arquitetura Analítica

### 3.1 Camadas

1. **Fonte Operacional (OLTP)**

   * Postgres transacional
   * Eventos de domínio

2. **Camada de Integração**

   * ETL incremental
   * CDC (Change Data Capture)

3. **Data Warehouse (OLAP)**

   * Modelo estrela
   * Tabelas fato e dimensões

4. **Camada de Visualização**

   * Dashboards
   * Relatórios

---

## 4. Modelo de Dados Analítico

### 4.1 Dimensões Comuns

* Tempo (dia, mês, ano, fiscal)
* Empresa
* Filial
* Produto
* Cliente
* Fornecedor
* Centro de custo
* Centro de lucro

---

### 4.2 Fatos Principais

* Fato Vendas
* Fato Compras
* Fato Produção
* Fato Estoque
* Fato Financeiro
* Fato Custos

---

## 5. KPIs Corporativos

### 5.1 Comercial

* Receita bruta e líquida
* Ticket médio
* Conversão de vendas

### 5.2 Logística

* Giro de estoque
* Cobertura
* Ruptura

### 5.3 Produção

* OEE
* Eficiência
* Desvios de custo

### 5.4 Financeiro

* Fluxo de caixa
* Inadimplência
* EBITDA

---

## 6. Dashboards

### 6.1 Tipos

* Operacional
* Gerencial
* Executivo

### 6.2 Características

* Filtros dinâmicos
* Drill-down
* Drill-through

---

## 7. Relatórios Corporativos

* DRE gerencial
* DRE legal
* Balanço
* Balancete
* Curva ABC

---

## 8. Drill-Down Transacional

* KPI → Documento → Item → Evento

---

## 9. Segurança Analítica

* Respeita perfis do ERP
* Restrição por empresa/filial
* Dados sensíveis mascarados

---

## 10. Performance e Atualização

* Atualização incremental
* Agendamento
* Cache de métricas

---

## 11. Alertas e Monitoramento

* Metas
* Limiares
* Notificações

---

## 12. Planejamento e Forecast

* Projeção de vendas
* Simulações
* Cenários

---

## 13. Auditoria Analítica

* Versões de relatórios
* Logs de acesso

---

## 14. Integração com Módulos

* Comercial
* Logística
* Financeiro
* Produção
* Custos

---

## 15. Transações (T-Codes)

* BW01 — Cubos
* BI01 — Dashboards
* BI02 — Relatórios

---

## 16. Regras de Ouro

1. BI não corrige dado operacional
2. Métrica é única e padronizada
3. Toda análise tem origem rastreável

---

**Este módulo transforma dados do AURORA ERP em decisão estratégica.**
