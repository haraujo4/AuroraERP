# AURORA ERP

## Documento 19 — Integração Fiscal (NF-e, NFC-e, NFS-e)

**Stack:** .NET · Postgres · WebServices SEFAZ / Prefeituras · Provedores Fiscais

---

## 1. Objetivo do Documento

Definir a **arquitetura fiscal oficial** do AURORA ERP para emissão, consulta, cancelamento e gestão de **Notas Fiscais Eletrônicas**, garantindo:

* Conformidade legal
* Escalabilidade
* Baixo acoplamento
* Auditoria completa

---

## 2. Tipos de Documentos Fiscais Suportados

### 2.1 NF-e (Modelo 55)

* Venda de produtos
* Circulação de mercadorias

### 2.2 NFC-e (Modelo 65)

* Varejo
* Consumidor final

### 2.3 NFS-e

* Prestação de serviços
* Integração municipal

---

## 3. Estratégias de Integração Fiscal

### Opção A — Integração Direta (Não recomendada)

* Comunicação direta com SEFAZ
* Alto custo de manutenção
* Mudanças frequentes

### Opção B — Provedor Fiscal (Recomendado)

Integração via APIs especializadas:

* Focus NFe
* TecnoSpeed
* Nuvem Fiscal
* Arquivei (consulta)

✔ Abstração legal
✔ Atualizações automáticas
✔ Menor risco jurídico

---

## 4. Arquitetura Fiscal no AURORA ERP

```
Evento Fiscal
     ↓
Fiscal Service
     ↓
Adapter Provedor Fiscal
     ↓
SEFAZ / Prefeitura
```

---

## 5. Serviço Fiscal Central

### 5.1 Responsabilidades

* Montagem do XML
* Validação de regras fiscais
* Assinatura digital
* Envio
* Tratamento de retorno

### 5.2 Interface

```csharp
IFiscalService {
   EmitirNotaFiscal(FiscalRequest);
   CancelarNotaFiscal(id);
   ConsultarStatus(chave);
}
```

---

## 6. Certificado Digital

### 6.1 Tipos

* A1 (arquivo) — recomendado
* A3 (token) — não recomendado para cloud

### 6.2 Armazenamento

* Vault
* Criptografado
* Nunca em banco puro

---

## 7. Cadastro Fiscal (Atomicidade)

### 7.1 Empresa

* CNPJ
* IE / IM
* Regime tributário
* CNAE
* Código município IBGE

### 7.2 Cliente / Fornecedor

* Tipo (PF/PJ)
* CPF/CNPJ
* Endereço fiscal completo
* Indicador IE

### 7.3 Produtos

* NCM
* CFOP
* CST / CSOSN
* Unidade
* Origem

### 7.4 Serviços

* Código serviço municipal
* ISS
* CNAE

---

## 8. Regras de Negócio Fiscais

* Não emitir NF sem contrato/origem
* Recalcular impostos no momento da emissão
* Bloquear edição após autorização

---

## 9. Fluxo de Emissão

1. Evento de faturamento
2. Validação cadastral
3. Montagem XML
4. Envio ao provedor
5. Retorno autorização
6. Persistência
7. Notificação (e-mail / sistema)

---

## 10. Tratamento de Erros

* Rejeição → correção
* Timeout → retry
* Falha grave → fila de erro

---

## 11. Cancelamento e Inutilização

* Prazo legal
* Justificativa obrigatória
* Log jurídico

---

## 12. Armazenamento Fiscal

* XML original
* XML autorizado
* DANFE PDF
* Protocolo SEFAZ

---

## 13. Auditoria e Compliance

* Hash do XML
* Data/hora
* Usuário
* Origem

---

## 14. Integração com Outros Módulos

* Financeiro → títulos
* Comercial → faturamento
* Produção → liberação
* E-mail → envio NF

---

## 15. Multi-empresa e Multi-filial

* Certificado por empresa
* Sequência fiscal independente

---

## 16. Ambientes

* Homologação
* Produção

---

## 17. Regras de Ouro Fiscal

1. Fiscal nunca é síncrono
2. Nunca confiar apenas no PDF
3. XML é a verdade

---

## 18. Integração com Nuvem Fiscal (Implementação Prática)

### 18.1 Visão Geral

O AURORA ERP utilizará a **Nuvem Fiscal** como **provedor fiscal oficial**, responsável por:

* Comunicação com SEFAZ e Prefeituras
* Validação legal
* Assinatura e autorização de documentos fiscais

O ERP **não implementa regras fiscais diretamente**, apenas orquestra eventos.

---

### 18.2 Credenciais e Segurança

* API Key: fornecida pela Nuvem Fiscal
* Armazenamento: Secret Manager / Variável de ambiente
* Nunca versionar no código

Exemplo (Docker):

* NUVEM_FISCAL_API_KEY
* NUVEM_FISCAL_BASE_URL

---

### 18.3 Cliente HTTP no Backend (.NET)

Responsável por:

* Autenticação via header
* Timeout controlado
* Retry automático

Headers obrigatórios:

* Authorization: Bearer <API_KEY>
* Content-Type: application/json

---

### 18.4 Fluxo de Emissão NF-e / NFS-e

1. Evento de faturamento aprovado
2. ERP monta payload fiscal
3. Envio para API Nuvem Fiscal
4. Recebimento de protocolo
5. Consulta assíncrona de status
6. Autorização ou rejeição
7. Persistência e notificação

---

### 18.5 Cadastro Obrigatório para Integração

#### Empresa

* CNPJ
* Razão social
* Regime tributário
* Certificado A1 (upload)

#### Produtos

* NCM
* CFOP
* CST / CSOSN

#### Serviços

* Código municipal
* Alíquota ISS

---

### 18.6 Ambientes

* Homologação: sandbox da Nuvem Fiscal
* Produção: endpoint oficial

Ambiente definido por configuração, nunca por código.

---

### 18.7 Tratamento de Retornos

* status = authorized → gerar financeiro + e-mail
* status = rejected → registrar erro + liberar correção
* status = processing → manter fila de consulta

---

### 18.8 Armazenamento de Artefatos

* XML autorizado
* PDF (DANFE / NFS-e)
* Protocolo

Persistidos com hash de integridade.

---

### 18.9 Observabilidade

* Log de request/response (sem dados sensíveis)
* Métricas de tempo de autorização
* Alertas de falha

---

### 18.10 Regras de Ouro com Nuvem Fiscal

1. Nunca bloquear fluxo aguardando SEFAZ
2. Sempre consultar status após envio
3. XML é a fonte da verdade

---

**Este documento define o módulo fiscal oficial do AURORA ERP.**
