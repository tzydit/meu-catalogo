# 🎬 Meu Catálogo de Filmes

Uma aplicação web moderna e responsiva para catalogar e gerenciar filmes, desenvolvida com Vue 3, TypeScript e uma interface elegante e intuitiva.

## 📋 Sobre o Projeto

O **Meu Catálogo** é uma plataforma completa para amantes de cinema que permite explorar, avaliar e organizar filmes de forma prática e visual. Com um design moderno e responsivo, oferece uma experiência fluida em todos os dispositivos.

## ✨ Funcionalidades Principais

### 🔐 **Autenticação e Usuários**
- Sistema completo de login e cadastro
- Autenticação JWT com controle de sessão
- Perfis de usuário com diferentes permissões
- Área administrativa para gestão de conteúdo

### 🎭 **Gestão de Filmes**
- Listagem responsiva com grid adaptável (4 colunas desktop, 2 mobile)
- Cards uniformes com design moderno e animações
- Páginas detalhadas com informações completas
- Sistema de busca em tempo real por título
- Filtros inteligentes por gênero com lógica de interseção
- Criação e edição de filmes (administradores)

### ⭐ **Sistema de Avaliações**
- Avaliação de 1 a 5 estrelas
- Reviews personalizadas dos usuários
- Cálculo automático de médias
- Interface intuitiva para cadastro de comentários

### ❤️ **Favoritos**
- Sistema completo de favoritos
- Página dedicada para filmes favoritados
- Sincronização com localStorage
- Botões de ação com confirmações elegantes

### 📱 **Experiência do Usuário**
- Design totalmente responsivo
- Interface dark mode moderna
- Animações suaves e hover effects
- Confirmações elegantes com SweetAlert2
- Header fixo com menu hamburguer mobile
- Navegação intuitiva entre páginas

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool moderna e rápida
- **Vue Router 4** - Roteamento SPA
- **Axios** - Cliente HTTP para APIs
- **SweetAlert2** - Modais e confirmações elegantes

### **Arquitetura**
- **Composition API** - API moderna do Vue 3
- **Componentes reutilizáveis** - Arquitetura modular
- **Stores** - Gerenciamento de estado
- **Services** - Camada de abstração para APIs
- **TypeScript interfaces** - Tipagem forte

## 🚀 Instalação e Execução

### **Pré-requisitos**
- Node.js 16+ instalado
- npm ou yarn como gerenciador de pacotes
- Backend da API executando na porta 8080

### **1. Clonar o repositório**
```bash
git clone <url-do-repositorio>
cd meu-catalogo
```

### **2. Instalar dependências**
```bash
npm install
```

### **3. Executar em modo desenvolvimento**
```bash
npm run dev
```

### **4. Build para produção**
```bash
npm run build
```

### **5. Preview da build**
```bash
npm run preview
```

## 🗂️ Estrutura do Projeto

```
src/
├── api/           # Configurações do axios
├── assets/        # Recursos estáticos
├── components/    # Componentes reutilizáveis
│   ├── AppHeader.vue
│   ├── MovieCard_new.vue
│   ├── GenreFilter.vue
│   ├── ReviewForm.vue
│   └── MovieReview.vue
├── router/        # Configurações de roteamento
├── services/      # Serviços de API e utilitários
│   ├── api.js
│   ├── userService.ts
│   ├── favoritesService.ts
│   └── jwtHelper.ts
├── stores/        # Gerenciamento de estado
├── views/         # Páginas da aplicação
│   ├── MovieListView.vue
│   ├── MovieDetailView.vue
│   ├── FavoritesView.vue
│   ├── CreateMovieView.vue
│   ├── LoginView.vue
│   └── RegisterView.vue
├── types.ts       # Interfaces TypeScript
└── main.ts        # Ponto de entrada
```

## 🛣️ Rotas da Aplicação

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | MovieListView | Página principal com listagem de filmes |
| `/filme/:id` | MovieDetailView | Detalhes completos do filme |
| `/favoritos` | FavoritesView | Filmes marcados como favoritos |
| `/perfil` | ProfileView | Perfil do usuário logado |
| `/criar-filme` | CreateMovieView | Criação de novos filmes (admin) |
| `/editar-filme/:id` | EditMovieView | Edição de filmes (admin) |
| `/gerenciar-filmes` | ManageMoviesView | Gestão de filmes (admin) |
| `/login` | LoginView | Tela de autenticação |
| `/cadastro` | RegisterView | Registro de novos usuários |

## 🔌 Integração com API

### **Endpoints Utilizados**
- `GET /movies` - Listagem de filmes
- `GET /movies/:id` - Detalhes do filme
- `POST /movies` - Criação de filme
- `PUT /movies/:id` - Atualização de filme
- `DELETE /movies/:id` - Exclusão de filme
- `GET /generos` - Lista de gêneros
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Cadastro
- `GET /reviews/:movieId` - Reviews do filme
- `POST /reviews` - Criação de review

### **Configuração**
Base URL configurada para `http://localhost:8080`

## 📱 Responsividade

### **Breakpoints**
- **Desktop**: 1200px+ (4 colunas)
- **Tablet**: 700px-1199px (2-3 colunas)
- **Mobile**: <700px (2 colunas)
- **Mobile Small**: <400px (layout otimizado)

### **Características Responsivas**
- Grid adaptável para diferentes telas
- Menu hamburguer em dispositivos móveis
- Cards com tamanhos proporcionais
- Formulários otimizados para touch
- Tipografia escalável

## 🎨 Design System

### **Cores Principais**
- Primary: Tons de azul (#3b82f6)
- Background: Dark mode (#1a1a1a)
- Cards: (#2a2a2a)
- Text: (#ffffff)
- Borders: (#404040)

### **Componentes**
- Cards uniformes com sombras suaves
- Botões com gradientes e animações
- Inputs com bordas arredondadas
- Modais customizados com SweetAlert2

## 📦 Dependências

```json
{
  "dependencies": {
    "vue": "^3.5.17",
    "vue-router": "^4.5.1",
    "axios": "^1.10.0",
    "sweetalert2": "^11.22.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.0",
    "typescript": "~5.8.3",
    "vite": "^7.0.0",
    "vue-tsc": "^2.2.10"
  }
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com ❤️ usando Vue 3, TypeScript e Vite**

[🚀 Demo](#) • [📖 Documentação](#) • [🐛 Report Bug](#)

</div>
