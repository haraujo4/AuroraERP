# AURORA ERP

## Documento 16 — Comunicação, Eventos e Notificações em Tempo Real

**Stack:** .NET (SignalR) · React · Event-driven Architecture · Webhooks

---

## 1. Objetivo do Documento

Definir a **arquitetura oficial de comunicação do AURORA ERP**, cobrindo:

* Notificações em tempo real
* Comunicação assíncrona entre módulos
* Integrações externas (assinatura digital, fiscal, e-mail)
* Governança de eventos

Este documento estabelece como o ERP **reage aos acontecimentos do negócio**.

---

## 2. Princípios de Comunicação

1. Tudo que importa gera um evento
2. Eventos não dependem de interface
3. Comunicação síncrona só quando necessária
4. Usuário informado no momento certo
5. Histórico e auditoria obrigatórios

---

## 3. Tipos de Comunicação no ERP

### 3.1 Comunicação Síncrona

* REST APIs
* Usada para comandos

### 3.2 Comunicação Assíncrona

* Domain Events
* Integration Events
* Webhooks

---

## 4. Arquitetura Geral de Eventos

```
Evento de Domínio
      ↓
Event Handler
      ↓
Event Bus Interno
      ↓
┌──────────────┐
│ Notificações │
│ Integrações  │
│ Logs         │
└──────────────┘
```

---

## 5. Eventos de Domínio

### 5.1 Definição

Eventos que representam fatos relevantes do negócio.

Exemplos:

* OrcamentoCriado
* OrcamentoAprovado
* ContratoEnviado
* ContratoAssinado
* OrdemProducaoLiberada

---

## 6. Event Bus Interno

### 6.1 Função

* Desacoplar módulos
* Garantir escalabilidade
* Facilitar manutenção

### 6.2 Implementação

* In-memory (inicial)
* Mensageria externa (RabbitMQ / Azure Service Bus) futuramente

---

## 7. Notificações em Tempo Real

### 7.1 Tecnologia

* SignalR
* WebSockets

### 7.2 Fluxo

```
Evento ocorre
  ↓
Notification Service
  ↓
SignalR Hub
  ↓
Frontend recebe instantaneamente
```

---

## 8. Tipos de Notificação

| Tipo        | Exemplo           | Persistência |
| ----------- | ----------------- | ------------ |
| Informativa | Pedido criado     | Sim          |
| Atenção     | Contrato pendente | Sim          |
| Crítica     | NF rejeitada      | Sim          |

---

## 9. Armazenamento de Notificações

Campos obrigatórios:

* Id
* Usuário
* Tipo
* Severidade
* Evento origem
* Payload
* Lida
* Data

---

## 10. UI de Notificações

* Ícone com badge
* Lista cronológica
* Marcar como lida
* Redirecionamento contextual

---

## 11. Integração com Assinatura Digital

### 11.1 Fluxo

```
Contrato enviado
  ↓
Plataforma de assinatura
  ↓
Webhook
  ↓
ContratoAssinado Event
```

### 11.2 Requisitos

* Endpoint seguro
* Validação de origem
* Idempotência

---

## 12. Integração com Gateway Fiscal

* Eventos fiscais
* Rejeições
* Autorizações
* Cancelamentos

---

## 13. Comunicação por E-mail

### 13.1 Usos

* Orçamentos
* Contratos
* Avisos legais

### 13.2 Regras

* Templates versionados
* Log de envio

---

## 14. Webhooks Externos

### 14.1 Finalidade

* Receber eventos externos
* Atualizar status interno

### 14.2 Padrões

* Assinatura HMAC
* Retry automático
* Timeout

---

## 15. Segurança da Comunicação

* Autenticação
* Autorização
* Criptografia

---

## 16. Observabilidade

* Log de eventos
* Tracing
* Auditoria

---

## 17. Governança de Eventos

* Catálogo central
* Versionamento
* Depreciação controlada

---

## 18. Regras de Ouro

1. Evento é fato, não comando
2. Notificação não substitui processo
3. Webhook sempre idempotente

---

**Este documento torna o AURORA ERP reativo, vivo e orientado a eventos.**
