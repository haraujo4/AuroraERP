# AURORA ERP

## Documento 15 — Padrão de Transações, Navegação e Busca (T-Codes)

**Referência:** SAP GUI Classic · SAP Fiori Launchpad · TOTVS Protheus

---

## 1. Objetivo do Documento

Definir o **padrão oficial de navegação, transações e busca global** do AURORA ERP, garantindo:

* Alta produtividade (power users)
* Navegação previsível
* Padronização entre módulos
* Experiência similar ao SAP GUI Classic

Este documento é **normativo e obrigatório**.

---

## 2. Conceito de Transação (T-Code)

### 2.1 Definição

Uma **Transação** é uma unidade funcional que executa um processo específico do ERP.

Exemplos:

* Criar Pedido de Venda
* Consultar Nota Fiscal
* Encerrar Ordem de Produção

Cada transação possui:

* Código único
* Nome funcional
* Tela principal
* Permissões

---

## 3. Estrutura Padrão de T-Codes

### 3.1 Formato

```
MMM-AAA-NNN
```

* **MMM** → Módulo
* **AAA** → Ação
* **NNN** → Sequência

### 3.2 Exemplos

* COM-CRI-001 → Criar Pedido de Venda
* FIN-CON-010 → Consultar Contas a Pagar
* LOG-EXP-005 → Expedição de Mercadoria

---

## 4. Prefixos Oficiais por Módulo

| Módulo        | Prefixo |
| ------------- | ------- |
| Comercial     | COM     |
| CRM           | CRM     |
| Logística     | LOG     |
| Compras       | CMP     |
| Produção      | PRD     |
| Financeiro    | FIN     |
| Fiscal        | FIS     |
| Custos        | CST     |
| BI            | BI      |
| Segurança     | SEC     |
| Administração | ADM     |

---

## 5. Ações Padronizadas (AAA)

| Ação      | Código |
| --------- | ------ |
| Criar     | CRI    |
| Alterar   | ALT    |
| Consultar | CON    |
| Excluir   | EXC    |
| Aprovar   | APR    |
| Encerrar  | ENC    |
| Cancelar  | CAN    |
| Estornar  | EST    |
| Processar | PRO    |

---

## 6. Navegação Global

### 6.1 Barra Superior

Componentes obrigatórios:

* Campo de T-Code (atalho)
* Busca global
* Usuário logado
* Empresa / Filial
* Favoritos

---

## 7. Busca Global

### 7.1 Tipos de Busca

* Por T-Code
* Por documento (pedido, nota, título)
* Por cadastro (cliente, produto)
* Por texto livre

### 7.2 Regras

* Resultado em até 300ms
* Prioridade por contexto atual
* Sugestões inteligentes

---

## 8. Favoritos e Histórico

* Favoritos por usuário
* Histórico automático
* Ordem por frequência de uso

---

## 9. Layout Padrão de Tela de Transação

### 9.1 Estrutura

1. Cabeçalho
2. Área de seleção
3. Área de dados
4. Rodapé de ações

---

## 10. Atalhos de Teclado Globais

| Ação     | Atalho   |
| -------- | -------- |
| Executar | F8       |
| Salvar   | Ctrl + S |
| Voltar   | F3       |
| Ajuda    | F1       |
| Buscar   | Ctrl + F |

---

## 11. Controle de Permissões por Transação

* Autorização por T-Code
* Controle por ação
* Log de acesso

---

## 12. Experiência Power User

* Navegação sem mouse
* Preenchimento em lote
* Copiar/colar estruturado

---

## 13. Versionamento de Transações

* T-Code imutável
* Nova versão gera novo código
* Histórico preservado

---

## 14. Padrões de Erro e Mensagens

* Mensagens técnicas codificadas
* Mensagens amigáveis ao usuário

---

## 15. Governança de T-Codes

* Catálogo central
* Aprovação obrigatória
* Auditoria

---

## 16. Regras de Ouro

1. Toda funcionalidade nasce como transação
2. Sem T-Code, não existe funcionalidade
3. T-Code é contrato de uso

---

**Este documento define a experiência operacional definitiva do AURORA ERP.**
