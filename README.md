# unifit-backend

![Node](https://img.shields.io/badge/node-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-supabase-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/auth-JWT-black?logo=jsonwebtokens&logoColor=white)

Backend do UniFit — app de musculação com gamificação.

Stack: Node.js, Express e PostgreSQL (Supabase).

---

## Como rodar

```bash
npm install
npm run dev
```

Precisa de um `.env` na raiz com:

```
DATABASE_URL=
JWT_SECRET=
ZAPI_INSTANCE_ID=
ZAPI_TOKEN=
PORT=3000
```

---

## Autenticação

O login não usa senha. O aluno informa o celular, recebe um código pelo WhatsApp e usa esse código pra entrar.

```
POST /auth/solicitar-codigo   { "celular": "5511999999999" }
POST /auth/validar-codigo     { "celular": "...", "codigo": "123456" }
```

O segundo endpoint retorna um `token`. Todas as rotas protegidas exigem:

```
Authorization: Bearer <token>
```

---

## Rotas

```
GET    /usuarios/perfil
PUT    /usuarios/perfil

POST   /treinos
GET    /treinos
GET    /treinos/:id
PUT    /treinos/:id
DELETE /treinos/:id
POST   /treinos/:id/iniciar
POST   /treinos/:id/concluir

POST   /academias/:id/importar-csv
GET    /academias/:id/membros
PATCH  /academias/:id/membros/:userId
```

---

## Estrutura

```
src/
├── app.js
├── config/
├── middlewares/
└── modules/
    ├── auth/
    ├── usuarios/
    ├── treinos/
    └── academias/
```

Cada módulo tem routes, controller e service.
