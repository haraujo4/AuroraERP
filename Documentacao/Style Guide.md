# AURORA ERP

## Documento 1 — Style Guide UI/UX

**Referência visual:** SAP GUI Classic (ECC)

---

## 1. Objetivo do Style Guide

Definir **padrões visuais, comportamentais e estruturais** para todas as telas do AURORA ERP, garantindo:

* Consistência corporativa
* Usabilidade empresarial
* Familiaridade imediata para usuários SAP/TOTVS
* Escalabilidade visual para centenas de transações

Este guia é **normativo**: nenhuma tela pode fugir destes padrões.

---

## 2. Princípios de UX Corporativo

### 2.1 Clareza > Estética

* Interface funcional, não decorativa
* Zero ambiguidade em ações críticas

### 2.2 Densidade de Informação

* Alta densidade de dados
* Uso intensivo de grids e tabelas
* Evitar espaços vazios excessivos

### 2.3 Previsibilidade

* Mesmo padrão para criar, alterar, visualizar
* Comportamentos idênticos entre módulos

---

## 3. Layout Base da Aplicação

### 3.1 Estrutura Global (Shell)

```
+--------------------------------------------------+
| Menu Superior (global actions)                   |
+--------------------------------------------------+
| T-Code / Command Bar                             |
+------------------+-------------------------------+
| Navigation Tree  | Área de Conteúdo              |
| (Sidebar)        |                               |
|                  |                               |
+------------------+-------------------------------+
| Status Bar (mensagens e estado)                  |
+--------------------------------------------------+
```

---

## 4. Menu Superior

### 4.1 Funções Obrigatórias

* Sistema
* Favoritos
* Utilitários
* Ajuda
* Usuário (perfil, logout)

### 4.2 Comportamento

* Sempre visível
* Não colapsável
* Acesso rápido a funções globais

---

## 5. Barra de Comandos (T-Code)

### 5.1 Conceito

Campo único para execução de transações, inspirado no SAP.

### 5.2 Requisitos Funcionais

* Autocomplete por:

  * Código
  * Nome da transação
* Execução via ENTER
* Histórico por usuário
* Favoritos

### 5.3 Exemplos

* `BP01` — Criar Parceiro de Negócio
* `VA01` — Criar Pedido de Venda

---

## 6. Navigation Tree (Sidebar)

### 6.1 Estrutura

* Árvore hierárquica
* Expansível / recolhível
* Persistência de estado por usuário

### 6.2 Organização

* Módulo

  * Submódulo

    * Transação

---

## 7. Área de Conteúdo

### 7.1 Tipos de Tela

#### 7.1.1 Tela de Seleção (Selection Screen)

* Filtros
* Intervalos
* Datas
* Valores

#### 7.1.2 Tela de Lista (ALV-like)

* Tabelas densas
* Ordenação
* Filtros
* Totalizadores

#### 7.1.3 Tela de Manutenção

* Criar (Create)
* Alterar (Change)
* Visualizar (Display)

---

## 8. Padrão de Formulários

### 8.1 Estrutura

* Cabeçalho (dados principais)
* Abas (tabs)
* Seções colapsáveis

### 8.2 Regras

* Labels sempre acima
* Campos obrigatórios sinalizados
* Ajuda contextual (tooltip)

---

## 9. Componentes UI Padronizados

### 9.1 Inputs

* Text
* Number
* Date
* Select
* Search Help (F4)

### 9.2 Botões

* Primário: salvar / confirmar
* Secundário: cancelar
* Crítico: excluir

---

## 10. Tabelas (ALV Web)

### 10.1 Funcionalidades Obrigatórias

* Scroll horizontal e vertical
* Colunas configuráveis
* Exportação (CSV, Excel)
* Totalização

---

## 11. Status Bar

### 11.1 Tipos de Mensagem

* Sucesso (verde)
* Informação (azul)
* Aviso (amarelo)
* Erro (vermelho)

### 11.2 Comportamento

* Sempre visível
* Mensagem mais recente em destaque

---

## 12. Tipografia

### 12.1 Fonte

* Sans-serif neutra
* Alta legibilidade

### 12.2 Hierarquia

* Títulos: forte
* Labels: médio
* Dados: regular

---

## 13. Paleta de Cores (SAP-like)

* Fundo principal: cinza claro
* Containers: cinza médio
* Texto: preto / cinza escuro
* Destaques: azul corporativo

---

## 14. Tailwind — Convenções

### 14.1 Espaçamentos

* Base: 4px
* Padding padrão: 8px / 12px

### 14.2 Bordas

* 1px sólido
* Radius mínimo

---

## 15. Responsividade

### 15.1 Desktop (prioritário)

* Layout completo

### 15.2 Tablet

* Sidebar colapsável

### 15.3 Mobile

* Acesso restrito
* Telas críticas apenas consulta

---

## 16. Acessibilidade

* Navegação por teclado
* Contraste mínimo
* Labels explícitos

---

## 17. Regras de Ouro

1. Nenhuma tela fora do padrão
2. Nenhum componente custom fora do guide
3. Usabilidade corporativa acima de estética

---

**Este Style Guide é obrigatório para todo o AURORA ERP.**
