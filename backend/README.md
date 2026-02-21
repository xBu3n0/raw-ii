# Backend

## Visão Geral

Aplicação backend desenvolvida em **NestJS**, seguindo os padrões **Domain-Driven Design (DDD)** e **Clean Architecture**. O projeto é estruturado com separação clara de responsabilidades entre as camadas de domínio, aplicação e infraestrutura.

---

## Estrutura do Projeto

### Configuração Principal

 - **Dockerfile / Dockerfile.dev**: Configurações de contêiner para ambientes de produção e desenvolvimento;
 - **Arquivos `.env`**: Configurações de ambiente para diferentes estágios de implantação;
 - **nest-cli.json**: Configuração da CLI do NestJS;
 - **tsconfig.json**: Configuração do compilador TypeScript;
 - **eslint.config.mjs / .prettierrc**: Regras de qualidade e formatação de código;

---

## Código-Fonte (`/src`)

### Módulos

 - **app.module.ts**: Módulo raiz da aplicação;
 - **app-listener.module.ts**: Módulo responsável pelos listeners de eventos e microserviços;
 - **main.ts**: Ponto de entrada da aplicação e inicialização da API e do microserviço;

---

### Camada Comum (`/src/common`)

Componentes reutilizáveis e funcionalidades compartilhadas:

 - **consts/**: Constantes da aplicação (JWT, configurações do RabbitMQ);
 - **dtos/**: Objetos de Transferência de Dados para requisições e respostas;
 - **exceptions/**: Exceções personalizadas;
 - **filters/**: Filtros de exceção HTTP para tratamento centralizado de erros;
 - **guards/**: Guards de autenticação e decorators;
 - **interceptors/**: Interceptadores para padronização das respostas da API;
 - **jwt/**: Módulo e serviços de autenticação JWT;
 - **primitives/**: Objetos de Valor para entidades de domínio;
 - **prisma/**: Configuração e serviço do cliente de banco de dados;
 - **rmq/**: Módulo de integração com RabbitMQ;

---

### Camada de Serviços (`/src/services`)

Implementação modular da lógica de negócio:

 - **auth/**: Serviço de autenticação com casos de uso, eventos de domínio e repositórios;

Cada serviço segue a organização:

 - `application/`: Casos de uso e serviços de aplicação;
 - `domain/`: Entidades, regras de negócio, eventos, exceções e interfaces de repositório;
 - `dtos/`: Estruturas de dados de requisição e resposta;
 - `infrastructure/`: Controllers, gateways e implementações de repositórios;

---

### Banco de Dados (`/src/prisma` & `/generated`)

 - **schema.prisma**: Definição dos modelos de dados;
 - **migrations/**: Histórico de migrações;
 - **generated/**: Código gerado pelo Prisma, incluindo tipos e cliente de banco de dados;

---

### Tipos (`/src/types`)

 - **express.d.ts**: Extensões de tipagem para o Express;

---

### Testes

 - **app.e2e-spec.ts**: Testes de ponta a ponta;
 - **jest-e2e.json**: Configuração de testes E2E com Jest;

---

## Inicialização da Aplicação

A aplicação é composta por dois processos executados de forma integrada:

### API HTTP

 - Prefixo global definido como `/api/v1`;
 - CORS habilitado;
 - Validação global com `ValidationPipe`, incluindo padronização de erros de entrada;
 - Interceptador global para padronização das respostas;
 - Filtro global para tratamento centralizado de exceções HTTP;
 - Documentação Swagger gerada automaticamente e disponível em `/api`, com suporte a autenticação Bearer (JWT);
 - Servidor HTTP executando na porta 80;

### Event Driven Development & Microserviço RabbitMQ

O backend adota **Event-Driven Development** como estratégia arquitetural para promover baixo acoplamento, escalabilidade e propagação explícita de mudanças de estado entre serviços.

 - Inicializado a partir do `AppListenerModule`;
 - Transporte RMQ configurado via variável de ambiente;

Essa configuração permite:

 - Comunicação assíncrona baseada em eventos entre o próprio serviço e entre serviços.

---

## Padrões Arquiteturais

### Domain-Driven Design (DDD)

- Separação entre domínio, aplicação e infraestrutura;
- Uso de Objetos de Valor para primitivas tipadas;
- Entidades e eventos de domínio para encapsulamento da lógica de negócio;

### Clean Architecture

- Injeção de dependências para baixo acoplamento;
- Padrão Repository para abstração de acesso a dados;
- Casos de uso como unidades centrais de regra de negócio.

---

## Stack Tecnológica

 - **Framework**: NestJS;
 - **ORM**: Prisma;
 - **Mensageria**: RabbitMQ;
 - **Autenticação**: JWT;
 - **Linguagem**: TypeScript;
 - **Testes**: Jest;
 - **Qualidade de Código**: ESLint e Prettier;
