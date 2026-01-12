# AURORA ERP

## Documento 12 — UX / UI & Layout SAP GUI Classic (Web)

**Referência funcional:** SAP GUI Classic, SAP Fiori (estrutura), TOTVS SmartUI

---

## 1. Objetivo do Documento

Definir **padrões de experiência do usuário (UX)** e **interface visual (UI)** para o AURORA ERP, garantindo:

* Produtividade máxima
* Consistência visual
* Curva de aprendizado curta para usuários de ERP
* Identidade visual inspirada no **SAP GUI Classic**, adaptada para web moderna e responsiva

---

## 2. Princípios de UX Corporativo

1. **Velocidade > estética**
2. Navegação previsível
3. Usuário sempre sabe onde está
4. Toda ação é reversível (quando permitido)
5. Teclado é cidadão de primeira classe

---

## 3. Conceito Visual Geral

### 3.1 Inspiração SAP GUI Classic

* Layout em grade
* Cores neutras
* Alto contraste
* Densidade de informação elevada

### 3.2 Adaptação Web Moderna

* Componentização React
* Responsividade controlada
* Feedback visual imediato

---

## 4. Estrutura Global da Tela

### 4.1 Layout Base

```
+--------------------------------------------------+
| Top Bar: Empresa | Filial | Usuário | Busca     |
+------------------+--------------------------------
| Menu Árvore      | Área de Conteúdo               |
| (Sidebar)        |                                |
|                  |                                |
+------------------+--------------------------------+
| Status Bar: msg sistema | atalho | ajuda         |
+--------------------------------------------------+
```

---

## 5. Barra Superior (Top Bar)

### Elementos

* Logo AURORA ERP
* Empresa ativa
* Filial ativa
* Campo de busca global (T-Code)
* Usuário logado

### Regras

* Sempre visível
* Troca de contexto sem reload

---

## 6. Menu Principal (Árvore Funcional)

### Características

* Estrutura hierárquica por módulo
* Expansão recolhível
* Favoritos

### Exemplo

* Comercial

  * Pedido de venda
  * Clientes
* Logística

  * Estoque
  * Movimentações

---

## 7. Área de Conteúdo

### Tipos de Tela

1. **Listagem (ALV-like)**
2. **Manutenção (Cadastro)**
3. **Transacional**
4. **Consulta / Relatório**

---

## 8. Telas de Listagem (ALV Web)

### Características

* Colunas configuráveis
* Filtros avançados
* Ordenação
* Paginação virtual
* Exportação

---

## 9. Telas de Cadastro

### Estrutura

* Cabeçalho
* Abas
* Seções colapsáveis

### Regras

* Validação em tempo real
* Salvamento explícito

---

## 10. Telas Transacionais

### Exemplo: Pedido de Venda

* Cabeçalho
* Itens (grid)
* Totais
* Ações (Salvar, Aprovar, Cancelar)

---

## 11. Status Bar

### Função

* Mensagens do sistema
* Erros
* Avisos
* Confirmações

### Padrão

* Verde: sucesso
* Amarelo: aviso
* Vermelho: erro

---

## 12. Sistema de Mensagens

* Código da mensagem
* Texto objetivo
* Severidade

Exemplo:
`FI-023: Período contábil fechado`

---

## 13. Atalhos de Teclado

### Padrões

* F3: Voltar
* F8: Executar
* Ctrl+S: Salvar
* Ctrl+F: Buscar

---

## 14. Busca por Transação (T-Code)

### Comportamento

* Campo único
* Autocomplete
* Execução imediata

Exemplos:

* VA01 → Criar Pedido
* ME21 → Criar Pedido Compra

---

## 15. Responsividade (Sem perder densidade)

* Desktop: completo
* Tablet: menu recolhível
* Mobile: leitura e aprovação

---

## 16. Acessibilidade

* Navegação por teclado
* Contraste WCAG AA
* Labels explícitos

---

## 17. Feedback e Confirmação

* Toasts
* Modais críticos
* Loading states

---

## 18. Padrões de Erro

* Erro nunca apaga dados
* Foco no campo inválido

---

## 19. Consistência Visual

* Mesmo padrão em todos módulos
* Nenhuma tela “especial”

---

## 20. Regras de Ouro de UX

1. Usuário experiente deve ser rápido
2. Usuário novo deve ser guiado
3. Interface nunca surpreende

---

**Este documento define a experiência profissional do AURORA ERP.**
