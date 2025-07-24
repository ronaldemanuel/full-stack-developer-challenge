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

## 🧙‍♂️ Tipos de Itens e Lógica de Uso

Os itens no inventário podem ser de **quatro tipos principais**:

- `apparel` — Equipamentos de vestuário (armaduras).
- `weapons` — Armas.
- `consumables` — Itens consumíveis.
- `misc` — Itens diversos (não utilizáveis).

### 🧤 Subtipos por Tipo

- **Apparel**:
  - `chest`
  - `helmet`
  - `boots`
  - `gloves`
  
- **Weapons**:
  - `one-handed`
  - `two-handed`

---

### 🛠️ Caso de Uso: Usar Item

A aplicação deve conter um **caso de uso** chamado `UseItemUseCase`, com as seguintes regras:

#### 🪖 Apparels

- Quando um item do tipo `apparel` é usado:
  - O respectivo **slot do usuário** deve ser atualizado no banco de dados (ex: `equippedHelmet`, `equippedChest`, etc).
  - Se já houver um item no slot correspondente, ele deve ser **substituído** pelo novo.
  - Se o item usado **já estiver equipado**, ele deve ser **desequipado** (o slot deve ser limpo).

#### ⚔️ Weapons

- O usuário possui dois **slots de mão**: `leftHand` e `rightHand`.
- Ao usar um item `one-handed`:
  - Se `leftHand` estiver livre, equipar ali.
  - Caso contrário, se `rightHand` estiver livre, equipar ali.
  - Caso ambos estejam ocupados:
    - O item atual de `leftHand` deve ser movido para `rightHand`.
    - O novo item deve ser colocado em `leftHand`.
- Se o item já estiver equipado em alguma mão, ele deve ser **desequipado** daquela mão.

#### 🧪 Consumables

- Quando um `consumable` é usado:
  - Ele deve ser **removido do inventário**.
  - Seu efeito deve ser **aplicado diretamente no status do usuário**.
- Os três consumíveis obrigatórios:
  - `poção de vida` → aumenta o **HP** do usuário.
  - `poção de stamina` → aumenta o **SP** do usuário.
  - `poção de magia` → aumenta o **MP** do usuário.

#### 🚫 Misc

- Itens do tipo `misc` **não podem ser usados**.
- Ao tentar utilizar um item `misc`, um erro deve ser retornado ao usuário (`CannotUseItemError` ou similar).

---

## 🛒 Loja de Itens

A tela que exibe **itens que o usuário ainda não possui** funcionará como uma **loja in-game**, onde os usuários podem **comprar novos itens** usando o frontend mobile (React Native).

### 📦 Lógica de Compra

- Quando o usuário realizar a compra de um item:
  - O item será **adicionado ao inventário** do usuário.
  - Um **e-mail de confirmação de compra** será enviado imediatamente.

### 📧 E-mail de Compra Concluída

- O e-mail deve ser renderizado utilizando **React Email**.
- O projeto já possui uma estrutura base para e-mails — este novo e-mail deve ser integrado a ela.
- O componente deve seguir o estilo visual dos e-mails já existentes e conter:
  - Nome do item comprado.
  - Imagem (se aplicável).
  - Texto de agradecimento pela compra.
  - Instruções de onde encontrar o item dentro do app.

Exemplo de estrutura:

```tsx
import { Html, Text, Heading, Img, Button } from '@react-email/components';

export const PurchaseConfirmationEmail = ({ itemName, imageUrl }: { itemName: string; imageUrl: string }) => (
  <Html>
    <Heading>Obrigado pela sua compra!</Heading>
    <Text>Você adquiriu o item <strong>{itemName}</strong> com sucesso.</Text>
    {imageUrl && <Img src={imageUrl} alt={itemName} width="200" />}
    <Text>Ele já está disponível no seu inventário dentro do aplicativo.</Text>
    <Button href="https://seu-app.com/app/inventario">Ver meu inventário</Button>
  </Html>
);
