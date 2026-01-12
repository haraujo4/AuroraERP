# AURORA ERP

## Documento 13 — Style Guide & Design System

**Stack:** React + Vite + Tailwind CSS

---

## 1. Objetivo do Documento

Definir um **Design System corporativo**, consistente, escalável e altamente produtivo, que traduza o UX do AURORA ERP em componentes reutilizáveis, mantendo identidade visual estável e padrão enterprise.

Este style guide é **obrigatório para todos os módulos**.

---

## 2. Princípios de Design

1. Consistência > criatividade
2. Densidade informacional controlada
3. Feedback visual imediato
4. Acessibilidade nativa
5. Performance como regra

---

## 3. Tokens de Design (Base)

### 3.1 Cores (Enterprise Neutral)

```txt
--bg-main: #F5F6F8
--bg-panel: #FFFFFF
--bg-sidebar: #E9EDF2
--border-default: #D0D7E2

--text-primary: #1F2937
--text-secondary: #4B5563
--text-muted: #6B7280

--primary: #2563EB
--success: #16A34A
--warning: #D97706
--danger: #DC2626
```

---

### 3.2 Tipografia

* Fonte base: **Inter**
* Fallback: system-ui

```txt
text-xs  = 12px
text-sm  = 13px
text-base= 14px (padrão ERP)
text-lg  = 16px
text-xl  = 18px
```

---

### 3.3 Espaçamento

* Base unit: **4px**
* Usar escala Tailwind (p-1, p-2, p-3...)

---

## 4. Layout Base

### 4.1 Grid

* Sidebar fixa: 240px
* Conteúdo fluido
* Margens internas padronizadas

---

## 5. Componentes Fundamentais

### 5.1 Button

**Tipos:**

* Primary
* Secondary
* Ghost
* Danger

**Regras:**

* Sempre texto em caixa normal
* Ícone opcional à esquerda

---

### 5.2 Input

* Label sempre visível
* Placeholder auxiliar
* Validação inline

---

### 5.3 Select / Autocomplete

* Busca interna
* Keyboard-first

---

### 5.4 Table (ALV Web)

* Header fixo
* Scroll virtual
* Colunas redimensionáveis
* Ordenação múltipla

---

### 5.5 Tabs

* Horizontais
* Lazy loading de conteúdo

---

### 5.6 Modal

* Usar apenas para ações críticas
* Foco preso (focus trap)

---

### 5.7 Toast / Alerts

* Sucesso (verde)
* Aviso (amarelo)
* Erro (vermelho)

---

## 6. Estados Visuais

### 6.1 Loading

* Skeleton screens

### 6.2 Disabled

* Opacidade reduzida

### 6.3 Error

* Borda vermelha
* Mensagem clara

---

## 7. Formulários ERP

* Seções colapsáveis
* Abas por contexto
* Salvamento explícito

---

## 8. Ícones

* Biblioteca: Lucide Icons
* Tamanho padrão: 16px

---

## 9. Dark Mode (Opcional)

* Base neutra
* Mesmo contraste

---

## 10. Responsividade

* Desktop: completo
* Tablet: navegação
* Mobile: consulta/aprovação

---

## 11. Acessibilidade

* WCAG AA
* Navegação por teclado
* ARIA labels

---

## 12. Padrões de Código

* Componentes pequenos
* Props explícitas
* Sem lógica de negócio no UI

---

## 13. Versionamento do Design System

* SemVer
* Changelog obrigatório

---

## 14. Regras de Ouro

1. Nenhum CSS fora do Tailwind
2. Nenhuma tela fora do Design System
3. UX vence gosto pessoal

---

**Este documento transforma UX em código consistente no AURORA ERP.**
