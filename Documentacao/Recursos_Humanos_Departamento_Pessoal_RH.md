# AURORA ERP

## Documento 17 — Recursos Humanos & Departamento Pessoal (RH)

**Escopo:** RH Administrativo + Integrações com Folha e Financeiro
**Referência:** SAP HCM · TOTVS RH · Senior RH

---

## 1. Objetivo do Documento

Definir o **Módulo de Recursos Humanos do AURORA ERP**, focado em:

* Gestão administrativa de colaboradores
* Governança trabalhista
* Integração com Financeiro, Custos e Contábil
* Integração com sistemas externos de folha de pagamento

Este módulo **não executa cálculos de folha completos**, mas prepara e consolida todas as informações necessárias.

---

## 2. Princípios do Módulo de RH

1. RH é fonte oficial de dados de pessoas
2. Dados de RH impactam custos, contabilidade e produção
3. Histórico nunca é apagado
4. Folha de pagamento é integração, não núcleo
5. Conformidade legal mínima é obrigatória

---

## 3. Estrutura Organizacional

### 3.1 Cadastro de Empresa / Filial

* Empresa legal
* Filial
* CNPJ
* Endereço
* Responsáveis legais

### 3.2 Estrutura Interna

* Diretoria
* Departamento
* Setor
* Centro de custo

---

## 4. Cadastro de Colaboradores (Atomicidade Crítica)

### 4.1 Dados Pessoais

* Nome completo
* Nome social
* CPF
* RG
* Data de nascimento
* Sexo
* Estado civil
* Nacionalidade
* Endereço completo
* Contatos

### 4.2 Documentos Trabalhistas

* CTPS (número, série)
* PIS/PASEP
* Título de eleitor
* Certificado reservista

### 4.3 Dados Bancários

* Banco
* Agência
* Conta
* Tipo de conta

### 4.4 Dependentes

* Nome
* Grau de parentesco
* CPF
* Data de nascimento

---

## 5. Vínculo Trabalhista

### 5.1 Tipo de Contrato

* CLT
* PJ
* Estágio
* Temporário
* Aprendiz

### 5.2 Dados do Vínculo

* Data de admissão
* Cargo
* Função
* Jornada
* Salário base
* Benefícios
* Centro de custo
* Gestor responsável

---

## 6. Gestão de Cargos e Funções

* Código do cargo
* Descrição
* Nível hierárquico
* Faixa salarial
* Competências

---

## 7. Benefícios

* Vale transporte
* Vale refeição/alimentação
* Plano de saúde
* Outros benefícios

Regras:

* Valor fixo ou percentual
* Desconto parcial ou total

---

## 8. Férias e Afastamentos

### 8.1 Férias

* Período aquisitivo
* Período concessivo
* Lançamento manual

### 8.2 Afastamentos

* Licença médica
* Licença maternidade/paternidade
* Afastamentos legais

---

## 9. Rescisão Administrativa

* Tipo de rescisão
* Data
* Motivo
* Aviso prévio
* Bloqueio de acesso

---

## 10. Integração com Folha de Pagamento

### 10.1 Exportação de Dados

* Cadastro
* Eventos (férias, afastamentos, rescisão)

### 10.2 Importação de Resultados

* Salários
* Encargos
* Benefícios
* Descontos

---

## 11. Integração Financeira e Contábil

* Provisão de salários
* Provisão de encargos
* Rateio por centro de custo
* Lançamentos automáticos

---

## 12. Eventos de RH

Exemplos:

* ColaboradorAdmitido
* ColaboradorAfastado
* FeriasConcedidas
* RescisaoEfetivada

---

## 13. Segurança e LGPD

* Controle de acesso por perfil
* Dados sensíveis criptografados
* Log de acesso

---

## 14. Relatórios

* Quadro de funcionários
* Custos por centro de custo
* Histórico funcional

---

## 15. Auditoria

* Histórico de alterações
* Versionamento de dados

---

## 16. Regras de Ouro

1. RH é base de custo
2. Nenhum dado é excluído
3. Folha não é núcleo

---

**Este documento define o Módulo de Recursos Humanos do AURORA ERP.**
