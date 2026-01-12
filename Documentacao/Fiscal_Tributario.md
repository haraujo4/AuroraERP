# AURORA ERP

## Documento 8 — Fiscal & Tributário

**Referência funcional:** SAP FI-TAX / J1BTAX / TOTVS SIGAFIS

---

## 1. Objetivo do Módulo

Garantir **conformidade fiscal e tributária total** em todas as operações do ERP, controlando impostos indiretos, diretos e obrigações acessórias, com cálculo automático, rastreabilidade e integração contábil.

Este módulo é **transversal** a Comercial, Compras, Logística, Financeiro e Produção.

---

## 2. Princípios Fiscais Fundamentais

* Todo imposto nasce de uma **operação documentada**
* Regra fiscal depende de **origem, destino, produto e operação**
* Nenhum imposto é digitado manualmente
* Todo cálculo gera **evidência auditável**
* Fiscal nunca atua isolado do financeiro

---

## 3. Cadastro Base: Parâmetros Fiscais Globais

### 3.1 Parâmetros por Empresa

* Regime tributário (Simples, Presumido, Real)
* UF da matriz
* CNAE principal e secundários
* Indicador de contribuinte ICMS
* Indicador de IPI
* Indicador de ISS

---

## 4. Cadastro Fiscal de Produtos

### 4.1 Dados Obrigatórios

* NCM
* CEST
* EX TIPI
* Unidade tributável
* Origem da mercadoria

### 4.2 Classificações Fiscais

* Tipo de produto (revenda, industrialização, consumo, ativo)
* Incidência de impostos

---

## 5. Cadastro Fiscal de Parceiros (Cliente/Fornecedor)

### 5.1 Dados

* Tipo de contribuinte ICMS
* Inscrição estadual
* Inscrição municipal
* Regime tributário
* Indicadores de retenção

---

## 6. CFOP — Código Fiscal de Operações

### 6.1 Estrutura

* Entrada x Saída
* Interna x Interestadual x Exterior

### 6.2 Regras

* CFOP é determinado pela operação
* Um CFOP pode ter múltiplos cenários fiscais

---

## 7. Cenário Fiscal (Coração do Módulo)

### 7.1 Composição

* Empresa origem
* UF origem
* UF destino
* Produto
* Operação
* Cliente/Fornecedor

### 7.2 Resultado

* CFOP
* CST/CSOSN
* Alíquotas
* Base de cálculo

---

## 8. ICMS

### 8.1 Configurações

* ICMS próprio
* ICMS ST
* DIFAL
* FCP

### 8.2 Regras

* Cálculo automático
* Partilha quando aplicável

---

## 9. IPI

* Incidência por produto
* Base própria
* Destaque em NF

---

## 10. PIS / COFINS

### 10.1 Regimes

* Cumulativo
* Não cumulativo

### 10.2 Créditos

* Insumos
* Ativo imobilizado

---

## 11. ISS

* Serviço x Município
* Retenções
* Alíquota por cidade

---

## 12. Retenções na Fonte

* IRRF
* INSS
* CSLL
* PIS
* COFINS

---

## 13. Documento Fiscal Eletrônico

### 13.1 Tipos

* NF-e
* NFC-e
* NFS-e
* CT-e
* MDF-e

### 13.2 Ciclo

* Autorização
* Cancelamento
* Carta de correção

---

## 14. Integração Contábil

* Débitos e créditos automáticos
* Contas por imposto
* Apuração mensal

---

## 15. Apuração de Impostos

* ICMS
* IPI
* PIS/COFINS
* ISS

---

## 16. Obrigações Acessórias

* SPED Fiscal
* SPED Contribuições
* EFD-Reinf
* DCTF

---

## 17. Auditoria Fiscal

* Rastreabilidade completa
* Logs de alteração
* Reprocessamento controlado

---

## 18. Transações (T-Codes)

* J1B1N — Manutenção fiscal
* J1BTAX — Cálculo
* J1B3N — Apuração

---

## 19. Regras de Ouro

1. Fiscal define regra, sistema calcula
2. Documento sem cenário fiscal não emite
3. Imposto sempre integrado ao financeiro

---

**Este módulo torna o AURORA ERP legalmente utilizável no Brasil.**
