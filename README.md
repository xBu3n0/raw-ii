# Projeto Raw II

## Descrição

Raw II é um projeto para portfólio concebido para demonstrar domínio prático de arquitetura distribuída, segurança aplicada, testes automatizados e organização estrutural de código. A solução integra frontend responsivo, backend modular com separação clara de responsabilidades e comunicação assíncrona entre serviços por meio de mensageria.

Ele proporciona uma plataforma colaborativa onde usuários criam e participam em jogos desenvolvidos pela comunidade, com suporte integrado a chat em tempo real e sistema de pagamento para assinaturas e aquisição de conteúdo (jogos de outros usuários).

As decisões arquiteturais foram fundamentadas em três referências clássicas de engenharia de software:

 - [Secure by Design (Dan Bergh Johnsson, Daniel Deogun, Daniel Sawano)](https://a.co/d/0cEvub4a);
 - [Unit Testing Principles, Practices, and Patterns (Vladimir Khorikov)](https://a.co/d/00ILeGpF);
 - [Design Patterns: Elements of Reusable Object-Oriented Software (GoF)](https://a.co/d/05B8iGwM);

Essas obras influenciaram diretamente a modelagem de domínio, a organização das camadas, o uso de padrões estruturais e comportamentais e a abordagem orientada a testes desde a concepção dos serviços.

---

## Arquitetura Geral

A arquitetura segue um modelo orientado a serviços com responsabilidades isoladas e comunicação síncrona (HTTPS) e assíncrona (eventos).

![Arquitetura da aplicação](.docs/architecture%20-%20raw%20ii.png)

O sistema é composto por:

### Camada de Entrada
 - Frontend (Next.js): interface do usuário, consumo de APIs e gerenciamento de sessão JWT;
 - Reverse Proxy (Nginx): centraliza o roteamento HTTP, abstrai os serviços internos e permite configuração de TLS;


### Camada de Serviços
Serviços independentes organizados com arquitetura em camadas (Controller → Application → Domain → Infrastructure):

 - Auth (NestJS): autenticação, emissão e validação de JWT.
 - Payment: processamento de pagamentos (planejado);
 - Game: regras de negócio e estado do jogo (planejado);
 - Chat: comunicação em tempo real entre usuários (planejado);

Cada serviço é isolado, com dependências explícitas e comunicação via HTTP ou eventos publicados no broker.

### Infraestrutura
 - PostgreSQL: persistência relacional;
 - RabbitMQ: mensageria para eventos assíncronos;
 - Prometheus: coleta de métricas;
 - Grafana: visualização e monitoramento.

---

## Stack Tecnológico

### Nginx
 - Roteamento centralizado;
 - Terminação TLS;
 - Encaminhamento para múltiplos serviços.

### Frontend — NextJS []

### API — NestJS
 - Arquitetura limpa, separação de serviços e orientada a domínio;
 - Aplicação de EDD (Event-Driven Design);
 - Prisma ORM + PostgreSQL;
 - Swagger para documentação de APIs;
 - Integração com RabbitMQ para eventos;
 - Guards e decorators para controle de autorização;
 - Primitivas de domínio e integridade de estados;
 - Padrões de projeto;
 - Testes unitários seguindo a escola Clássica (O sistema sob teste `sut` é utilizado para testar comportamentos).

### Game - []


### Payment - []


### Chat - []


### Banco de Dados — PostgreSQL
 - Separação lógica entre serviços (utilização de schemas);

### Modelagem de Dados — PostgreSQL

A modelagem das tabelas reflete as entidades de domínio, garantindo integridade referencial e separação lógica entre serviços através de schemas dedicados.

**Estrutura de Schemas:**
 - `auth`: Usuários, sessões e credenciais;
 - `game`: Jogos, usuários, regras e estado das partidas;
 - `payment`: Transações e assinaturas;
 - `chat`: Mensagens e canais.

Cada schema é gerenciado pelo serviço responsável, permitindo evolução independente do modelo de dados.

**Visualização e Documentação:**
Para explorar a modelagem de dados, utilize o arquivo `.docs/modelagem - der.graphml` em um editor de grafos, como [yEd](https://www.yworks.com/yed-live/). O diagrama entidade-relacionamento (DER) documenta:
 - Tabelas e colunas de cada entidade;
 - Relacionamentos e restrições de chave estrangeira;
 - Cardinalidade entre entidades;

### Mensageria — RabbitMQ
 - Comunicação desacoplada entre serviços;
 - Publicação e consumo de eventos;
 - Base para escalabilidade horizontal.

### Observabilidade
 - Prometheus para scraping de métricas;
 - Grafana para dashboards e análise de desempenho.

---

## Influência Técnica das Referências

### Secure by Design
 - Validação explícita e integridade de estado;
 - Modelagem de domínio com invariantes protegidas;
 - Encapsulamento de regras críticas em primitivas de domínio;
 - Separação entre domínio, serviços e infraestrutura.

### Unit Testing Principles, Practices, and Patterns
 - Implementação de testes unitários seguindo a escola Clássica;
 - Infraestrutura desacoplada por interfaces;
 - Uso de mocks para isolamento de dependências.

### Design Patterns
Aplicação prática de padrões.

---

## Execução

### Pré-requisitos
 - Python 3;
 - Openssl;
 - Docker e Docker Compose.

### Setup Inicial

Execute o script de configuração:
```bash
python setup.py
```

Este script realiza:
 - Criação das variáveis de ambiente (`.env`) utilizando de referência o `.env.example`;
 - Geração de certificado autofirmado para ambiente local (acesso por `https://`).

### Iniciando os Containers

Após a configuração inicial, inicie os serviços com Docker Compose:

```bash
docker compose [-f compose.dev.yml] up -d
```

Este comando inicia:
 - Nginx;
 - Frontend Next.js;
 - Serviço Auth;
 - PostgreSQL;
 - RabbitMQ;
 - Prometheus;
 - Grafana.

Realize a migração das tabelas para o PostgreSQL:
```bash
docker compose exec auth npx prisma migrate deploy
```

Verificar status dos containers:
```bash
docker container list
```

Para parar os containers:
```bash
docker compose [-f compose.dev.yml] down
```


## Segurança e TLS

O projeto utiliza certificados autoassinados para ambiente local, gerados automaticamente pelo script `setup.py`. Isso permite acesso seguro via HTTPS, mas como não há validação de uma autoridade certificadora (CA), o navegador exibirá um aviso de segurança que deve ser aceito manualmente para prosseguir.
