# 🎬 Cinelog

Diário pessoal de filmes e séries: registre o que você já assistiu, está assistindo ou planeja assistir, com dados preenchidos automaticamente pela API do [TMDB](https://www.themoviedb.org/).

## ✨ Funcionalidades

- Busca de filmes e séries na TMDB com autocompletar
- Adicionar títulos à coleção pessoal, com status (`quero ver` / `assistindo` / `assistido`)
- Página de detalhes por título: sinopse, elenco, trailer e recomendações
- Para séries: número de temporadas, episódios e situação de exibição
- Avaliação por estrelas (1 a 5) e resenha pessoal, editáveis a qualquer momento
- Filtro por status e busca por título/gênero na Home (filmes e séries combinados)
- Estante "Assistindo agora" e paginação da coleção
- Adicionar um título semelhante à coleção com um clique

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
│       ├── models/           # Schemas do Mongoose (Movie, Show)
│       ├── services/         # Integração com a API do TMDB
│       ├── data/             # Camada de acesso a dados (CRUD)
│       └── routes/           # Endpoints REST (movies, shows, tmdb)
│
└── frontend/
    └── src/
        ├── types/            # Interfaces espelhadas do backend + MediaItem unificado
        ├── services/         # Cliente HTTP (axios)
        ├── hooks/            # useMovies, useShows
        ├── components/        # MediaCard, MediaList, MediaForm, StatusFilter, TmdbSearch...
        └── pages/            # HomePage, MoviePage, ShowPage, AboutPage, NotFoundPage
```

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/movies` | Lista todos os filmes salvos |
| GET | `/api/movies/:id` | Detalhes de um filme salvo |
| POST | `/api/movies` | Adiciona um filme à coleção |
| PUT | `/api/movies/:id` | Atualiza status, nota e/ou resenha |
| DELETE | `/api/movies/:id` | Remove um filme da coleção |
| GET | `/api/shows` | Lista todas as séries salvas |
| GET | `/api/shows/:id` | Detalhes de uma série salva |
| POST | `/api/shows` | Adiciona uma série à coleção |
| PUT | `/api/shows/:id` | Atualiza status, nota e/ou resenha |
| DELETE | `/api/shows/:id` | Remove uma série da coleção |
| GET | `/api/tmdb/search?query=` | Busca filmes na TMDB |
| GET | `/api/tmdb/:tmdbId/details` | Sinopse, elenco, trailer e recomendações de filme |
| GET | `/api/tmdb/tv/search?query=` | Busca séries na TMDB |
| GET | `/api/tmdb/tv/:tmdbId/details` | Sinopse, elenco, trailer, recomendações e temporadas/episódios de série |

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

- Autenticação de usuários (login, registo, recuperar senha) + landing page pública
- Dashboard de estatísticas pessoais
- Perfil público para compartilhar o diário

## 🙏 Créditos

Este produto usa a API do TMDB, mas não é endossado ou certificado pelo TMDB.
