import express, { Router } from 'express';
import postsRoutes from './interfaces/routes/posts-routes';
import { PostController } from './interfaces/http/controllers/posts/post-controller';
import { CreatePostUseCase } from './application/usecases/posts/create-post-use-case';
import { InMemoryPostRepository } from './infrastructure/database/inMemoryPostRepository';

const app = express();
const port = process.env.PORT || 3000;

// Configurando injeção de dependências
const postRepository = new InMemoryPostRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);
const postController = new PostController(createPostUseCase);

// Configurando rotas
const router = Router();
postsRoutes(router, postController);

app.use(express.json());
app.use("/posts", router);


app.get('/', (req, res) => {
  res.json({ message: 'API Tech Challenge Fase 2 - FIAP' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
