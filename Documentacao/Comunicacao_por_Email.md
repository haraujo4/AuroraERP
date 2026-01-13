# AURORA ERP

## Documento 18 — Comunicação por E-mail (Arquitetura, Regras e Usos)

**Stack:** .NET · SMTP (Hostinger) · React · Event-driven

---

## 1. Objetivo do Documento

Definir de forma **oficial e normativa** como o AURORA ERP realiza **disparo, controle e auditoria de e-mails**, incluindo:

* Arquitetura técnica de envio
* Integração com servidor SMTP (Hostinger)
* Casos de uso obrigatórios
* Governança, segurança e rastreabilidade

E-mail é tratado como **canal transacional e jurídico**, não apenas comunicação informal.

---

## 2. Princípios do Sistema de E-mail

1. Todo e-mail nasce de um evento
2. Nenhum e-mail é enviado diretamente da UI
3. Templates são versionados
4. Todo envio é auditável
5. Falha de e-mail não pode quebrar processo crítico

---

## 3. Arquitetura Geral de Envio

```
Evento de Negócio
      ↓
Email Dispatcher Service
      ↓
Template Engine
      ↓
SMTP Hostinger
      ↓
Destinatário
```

---

## 4. Integração com Hostinger (SMTP)

### 4.1 Protocolo

* SMTP autenticado
* TLS obrigatório

### 4.2 Configurações Técnicas

* Host: smtp.hostinger.com
* Porta: 587 (TLS)
* Usuário: conta de e-mail do domínio
* Senha: armazenada em secret

⚠️ Nunca versionar credenciais.

---

## 5. Serviço Central de E-mail

### 5.1 Interface Padrão

```csharp
IEmailService {
   Send(EmailMessage message);
}
```

### 5.2 Responsabilidades

* Montagem do e-mail
* Aplicação de template
* Envio SMTP
* Log de sucesso ou falha

---

## 6. Templates de E-mail

### 6.1 Estrutura

* HTML responsivo
* Cabeçalho institucional
* Conteúdo dinâmico
* Rodapé legal

### 6.2 Versionamento

* Código do template
* Versão
* Data de vigência

---

## 7. Armazenamento e Auditoria

Tabela EmailLog:

* Id
* Evento origem
* Destinatário
* Assunto
* Status (Enviado / Falha)
* Data/hora
* Tentativas

---

## 8. Casos de Uso Obrigatórios no AURORA ERP

### 8.1 Comercial / CRM

* Envio de orçamento ao cliente
* Notificação de aprovação de orçamento
* Follow-up automático

### 8.2 Contratos

* Envio de contrato para assinatura
* Aviso de contrato assinado
* Aviso de contrato expirado

### 8.3 Produção

* Ordem de produção liberada
* Atraso ou bloqueio

### 8.4 Financeiro

* Aviso de título vencido
* Confirmação de pagamento
* Nota fiscal emitida

### 8.5 Fiscal

* NF autorizada
* NF rejeitada
* Cancelamento

### 8.6 Segurança

* Reset de senha
* Criação de usuário
* Tentativa de acesso suspeita

---

## 9. Regras de Envio

* E-mails críticos → envio imediato
* E-mails informativos → fila
* Retry automático (3 tentativas)
* Backoff exponencial

---

## 10. Fila de E-mails

* Envio assíncrono
* Não bloquear transações
* Processamento em background

---

## 11. Integração com Eventos

Exemplos:

* OrcamentoAprovado → EnviarEmailOrcamento
* ContratoAssinado → EmailConfirmacaoContrato
* NotaFiscalEmitida → EmailNF

---

## 12. Preferências do Usuário

* Opt-in / Opt-out
* Idioma
* Tipo de notificação

---

## 13. Segurança e LGPD

* Não expor dados sensíveis
* Links com token
* Expiração automática

---

## 14. Monitoramento

* Taxa de falha
* Tempo de envio
* Alertas

---

## 15. Regras de Ouro

1. E-mail não é transação
2. Nunca confiar apenas no e-mail
3. Tudo deve ser rastreável

---

**Este documento define o sistema oficial de comunicação por e-mail do AURORA ERP.**
