# Bazar da Shirley — App de Venda de Roupas 👕📱

App mobile em **React Native (Expo)** para venda de roupas: login, cadastro de usuário, catálogo de produtos (com opção de cadastrar novos produtos), carrinho de compras e finalização de pedido.

## ✅ Requisitos atendidos

| Requisito | Onde está implementado |
|---|---|
| Recurso do celular: **Notificação** | `App.js` (permissão ao abrir), `LoginScreen.js` e `CheckoutScreen.js`, via `expo-notifications` |
| Recurso do celular: **GPS** | `HomeScreen.js` (endereço de envio) e `CheckoutScreen.js` (localização do pedido), via `expo-location` |
| Recurso do celular: **Vibração** | `LoginScreen.js`, `HomeScreen.js` e `CheckoutScreen.js`, via `Vibration` |
| **FlatList** | `HomeScreen.js` (catálogo) e `CheckoutScreen.js` (carrinho) |
| **Criptografia** | `src/utils/crypto.js` — hash SHA-256 para senhas + AES para o histórico de pedidos |
| **Persistência (AsyncStorage como "banco de dados")** | `src/utils/storage.js` — usuários, sessão, pedidos e produtos cadastrados |
| **Mínimo de 3 telas** | `LoginScreen`, `RegisterScreen`, `HomeScreen`, `AddProductScreen`, `CheckoutScreen`, `SuccessScreen` |
| **Testes automatizados (mín. 2)** | `crypto.test.js`, `storage.test.js` e `HomeScreen.test.js` |

## 🔑 Login e Cadastro

O AsyncStorage funciona como um banco de dados local com 4 "tabelas":

- **`@bazar:users`** — usuários cadastrados: `{ username, passwordHash }`. A senha **nunca** é salva em texto puro — é transformada em hash SHA-256 (`crypto-js`) antes de ser gravada.
- **`@bazar:session`** — qual usuário está logado agora.
- **`@bazar:orders`** — histórico de pedidos, criptografado com AES (reversível, pois precisamos ler o pedido de volta).
- **`@bazar:custom_products`** — produtos cadastrados pelo próprio usuário dentro do app.

Fluxo:
1. Na tela de **Cadastro**, o usuário informa usuário + senha → `registerUser()` salva o hash da senha.
2. Na tela de **Login**, `validateLogin()` gera o hash da senha digitada e compara com o hash salvo. Só libera o acesso se bater.

> **Por que não usamos `react-native-hash` (JSHash)?** Esse pacote depende de código nativo e só funciona com um build customizado via EAS Build — não funciona no Expo Go nem no Snack. Usamos `crypto-js`, que é 100% JavaScript e funciona em qualquer lugar sem configuração extra.

## 📂 Estrutura do projeto

```
bazar-da-shirley/
├── App.js
├── app.json
├── index.js
├── package.json
├── src/
│   ├── context/CartContext.js       # estado global do carrinho
│   ├── data/products.js             # catálogo inicial (mockado)
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── HomeScreen.js
│   │   ├── AddProductScreen.js      # cadastrar novo produto (AsyncStorage)
│   │   ├── CheckoutScreen.js
│   │   └── SuccessScreen.js
│   └── utils/
│       ├── crypto.js                # hash SHA-256 + AES
│       ├── storage.js               # "banco de dados" via AsyncStorage
│       └── format.js                # formatação de moeda (R$)
└── __tests__/
    ├── crypto.test.js
    ├── storage.test.js
    └── HomeScreen.test.js
```

## 🚀 Como rodar

```bash
npm install
npm start
```

Escaneie o QR Code com o **Expo Go**. Se faltar alguma dependência, rode `npx expo install --fix` para ajustar as versões automaticamente para a sua versão do Expo.

## 🧪 Como rodar os testes

```bash
npm test
```

## 🛠️ Tecnologias

Expo SDK 54, React 19, React Native 0.81, React Navigation (Native Stack), AsyncStorage, crypto-js (SHA-256 + AES), expo-location, expo-notifications, Vibration, Jest + Testing Library.
