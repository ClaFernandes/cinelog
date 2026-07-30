# 🎬 Cinelog

Diário pessoal de filmes: regista o que você já assistiu, está assistindo ou planeia assistir, com dados preenchidos automaticamente pela API do [TMDB](https://www.themoviedb.org/) (poster, ano, sinopse, elenco, trailer e gêneros).

Projeto full-stack desenvolvido como peça de portfólio, com foco em TypeScript de ponta a ponta, integração com API externa e um design system autoral ("Sala Escura").

## ✨ Funcionalidades

- Busca de filmes na TMDB com autocompletar (debounce, sem travar a digitação)
- Adicionar filmes à coleção pessoal, com status inicial (`quero ver` / `assistindo` / `assistido`)
- Página de detalhes por filme: sinopse, elenco, trailer (embed do YouTube) e filmes semelhantes
- Avaliação por estrelas (1 a 5) e resenha pessoal, editáveis a qualquer momento
- Filtro por status e busca por título/gênero na Home
- Estante "Assistindo agora" e paginação da coleção
- Adicionar um "filme semelhante" à coleção com um clique (atalho pré-preenchido)

## 🛠️ Stack

**Frontend:** React + TypeScript + Vite + React Router + lucide-react
**Backend:** Node.js + Express + TypeScript
**Banco de dados:** MongoDB Atlas via Mongoose
**API externa:** TMDB API v3 (com respostas em `pt-BR`)

## 📁 Estrutura do projeto

```
cinelog/
├── backend/
│   └── src/
│       ├── types/          # Interfaces e DTOs compartilhados
│       ├── db/              # Conexão com o MongoDB Atlas
│       ├── models/           # Schema do Mongoose (Movie)
│       ├── services/         # Integração com a API do TMDB
│       ├── data/             # Camada de acesso a dados (CRUD)
│       └── routes/           # Endpoints REST
│
└── frontend/
    └── src/
        ├── types/            # Interfaces espelhadas do backend
        ├── services/         # Cliente HTTP (axios)
        ├── hooks/            # useMovies — estado da coleção
        ├── components/        # MovieCard, MovieList, MovieForm, StatusFilter, TmdbSearch...
        └── pages/            # HomePage, MoviePage, NotFoundPage
```

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou MongoDB local)
- Uma chave de API do [TMDB](https://www.themoviedb.org/settings/api)

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com:

```
MONGO_URI=sua_connection_string_do_mongodb
TMDB_API_KEY=sua_chave_da_api_do_tmdb
PORT=3001
```

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173` (padrão do Vite).

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/movies` | Lista todos os filmes salvos |
| GET | `/api/movies/:id` | Detalhes de um filme salvo |
| POST | `/api/movies` | Adiciona um filme à coleção |
| PUT | `/api/movies/:id` | Atualiza status, nota e/ou resenha |
| DELETE | `/api/movies/:id` | Remove um filme da coleção |
| GET | `/api/tmdb/search?query=` | Busca filmes na TMDB |
| GET | `/api/tmdb/:tmdbId/details` | Sinopse, elenco, trailer e recomendações |

## 🎨 Design system — "Sala Escura"

| Cor | Uso |
|---|---|
| `#14161A` | Fundo principal |
| `#E4572E` | Cor primária (destaques, botões) |
| `#4FA3A0` | Cor secundária (links, filtros ativos) |
| `#F8F9FA` | Texto principal |
| `#A0AAB8` | Texto secundário/muted |

Fonte: **Poppins** (Google Fonts). Ícones: **lucide-react**.

## 📌 Roadmap futuro

- Autenticação de usuários (JWT)
- Dashboard de estatísticas pessoais (filmes/ano, gêneros mais vistos, média de notas)
- Perfil público para compartilhar o diário

## 🙏 Créditos

Este produto usa a API do TMDB, mas não é endossado ou certificado pelo TMDB.
