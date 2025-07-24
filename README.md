# 💼 Desafio Técnico: Inventário de RPG com Autenticação — estilo Skyrim

Estamos desenvolvendo uma aplicação que simula um **inventário de RPG**, inspirado na experiência de jogos como **Skyrim**, com foco em boas práticas de arquitetura (**DDD + CQRS**), autenticação moderna, **React Native**, **React Web** e um backend escalável com **NestJS + TRPC**.

O sistema terá **duas interfaces principais**:

- Um **painel web administrativo** (Admin) para cadastro e gerenciamento de itens.  
- Um **aplicativo mobile** (Expo + React Native) para que os usuários acessem, filtrem e manipulem seu inventário.

---

## 🧱 Arquitetura Backend — NestJS + DDD + CQRS

O backend deve ser implementado em **NestJS seguindo os princípios do DDD (Domain-Driven Design)** e utilizando o padrão arquitetural **CQRS (Command Query Responsibility Segregation)** por meio da biblioteca [`@nestjs/cqrs`](https://docs.nestjs.com/recipes/cqrs).

A aplicação deve ser dividida de forma clara entre:

- **Camada de domínio**: entidades, agregados, repositórios, eventos de domínio.
- **Camada de aplicação**: casos de uso, comandos, queries, handlers, DTOs.
- **Camada de infraestrutura**: TRPC, bancos de dados, autenticação, providers externos, integração com event bus.
- **Camada de interface**: endpoints TRPC, controladores, mapeamentos.

> O uso de **CQRS** permite separar comandos (ações que alteram o estado) de queries (leitura de dados), promovendo clareza, escalabilidade e testes mais previsíveis.

---

## 🔔 EventBus com Inngest — Substituível

A comunicação assíncrona entre partes do sistema (como envio de e-mails, recuperação de senha, eventos de domínio, etc.) deve ser feita por meio de um **EventBus**.

- Utilizar o **[Inngest](https://www.inngest.com/)** como implementação inicial do EventBus.
- Utilizar a lib [`nest-inngest`](https://github.com/thawankeane/nest-inngest).
- O EventBus deve ser **abstraído por uma interface**, permitindo substituição futura por outro provedor (ex: SQS, Kafka, Redis Streams etc.).
- Essa arquitetura garante **baixo acoplamento** e alta escalabilidade.

---

## 🔐 Autenticação com BetterAuth

Integração completa com o **BetterAuth**, incluindo:

- Login por **e-mail e senha** e **Google OAuth**.
- Implementar um **provider de autenticação para o NestJS** usando BetterAuth *(não existe pronto — será construído do zero)*.
- Integração com **BetterAuth Expo** no aplicativo mobile.
- Integração com **React Query** no frontend.

---

## 📨 Recuperação de Senha e Confirmação de E-mail

Utilizando:

- **Inngest** para gerenciar a fila de recuperação de senha e envio de e-mails.
- **Nodemailer** via [`@nest-modules/mailer`](https://github.com/nest-modules/mailer) para confirmação de e-mail e notificações.

---

## ⚙️ Tecnologias Utilizadas

### 🔧 Backend

- **NestJS** com **DDD**.
- Arquitetura baseada em **CQRS com `@nestjs/cqrs`**.
- Integração com **@nestjs/trpc**.
- **Drizzle ORM** com PostgreSQL.
- Validação com **Zod-first**.
- **EventBus desacoplado**, com **Inngest** como primeira implementação.
- Casos de uso como `UserItemUseCase`, com `UserItemCommand` e `UserItemQuery`.

### 📱 Frontend Mobile (React Native + Expo)

- **React Native Reusables** para componentes.
- Modais com [`@gorhom/react-native-bottom-sheet`](https://github.com/gorhom/react-native-bottom-sheet).
- Listagem infinita com **React Query**.
- Telas:
  - Itens que o usuário possui.
  - Itens que ainda não possui.
- UI inspirada no **inventário de Skyrim**.
- Login com **BetterAuth Expo**.

### 🖥️ Frontend Admin (React Web)

- Cadastro e edição de itens com **React Hook Form**.
- Interface com **ShadCN UI** (via Shad CDN ou local).
- Suporte a múltiplos administradores.

---

## 🔄 Funcionalidades-Chave

- Autenticação moderna com BetterAuth.
- Confirmação de e-mail e recuperação de senha com Inngest.
- Backend modular com NestJS + DDD + CQRS.
- EventBus desacoplado e substituível (começando com Inngest).
- Integração fullstack com **TRPC** e **Zod**.
- Listagem de inventário com filtros e paginação.
- Experiência inspirada em RPG para o mobile.
- Suporte a múltiplos usuários e permissões.
- Baseado no template [`create-t3-turbo`](https://github.com/t3-oss/create-t3-turbo).

---

## 🎮 Resumo da Experiência

> Imagine estar construindo o sistema de inventário de um jogo como **Skyrim**, mas com a robustez de um backend em **NestJS com DDD + CQRS**, a flexibilidade do **React Native**, e a segurança de uma **autenticação moderna com BetterAuth**.  
> Esse é o nosso objetivo: criar uma experiência rica, intuitiva e escalável tanto para jogadores quanto para administradores.
