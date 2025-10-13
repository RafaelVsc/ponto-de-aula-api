# Diagramas de Arquitetura

Esta seção contém representações visuais da arquitetura e do domínio da aplicação.

## Fluxo de uma Requisição (Clean Architecture)

O diagrama abaixo ilustra o fluxo de uma requisição através das camadas da aplicação, seguindo os princípios da Clean Architecture.

```mermaid
graph TD
    subgraph "Cliente"
        A[Requisição HTTP]
    end

    subgraph "Camada de Interface (src/interfaces)"
        B(Roteador)
        C(Controller)
        D[Middlewares]
    end

    subgraph "Camada de Aplicação (src/application)"
        E(Use Case)
    end

    subgraph "Camada de Domínio (src/domain)"
        F(Abstração do Repositório)
        G[Entidade]
    end

    subgraph "Camada de Infraestrutura (src/infrastructure)"
        H(Implementação do Repositório)
        I((Banco de Dados))
    end

    A --> B
    B -- chama --> C
    C -- invoca --> E
    E -- depende de --> F
    H -- implementa --> F
    E -- manipula --> G
    H -- acessa --> I
    C -- retorna --> A
```

## Diagrama de Classes do Domínio

Este diagrama mostra a estrutura das principais entidades do domínio e seus relacionamentos.

```mermaid
classDiagram
    direction LR

    class User {
        +string id
        +string name
        +string email
        +string username
        +string password
        +UserRole role
    }

    class Post {
        +string id
        +string title
        +string content
        +string authorId
        +string videoUrl
        +string imageUrl
        +string[] tags
    }

    class UserRole {
        <<enumeration>>
        STUDENT
        TEACHER
        SECRETARY
        ADMIN
    }

    User "1" -- "0..*" Post : "é autor de"
    User -- UserRole
```

## Diagrama de Sequência - Fluxo de Login

Este diagrama detalha a sequência de chamadas e interações entre os componentes do sistema durante o processo de autenticação de um usuário.

```mermaid
sequenceDiagram
    actor Client
    participant LoginController as Controller
    participant LoginUseCase as Use Case
    participant UserRepo as Repositório de Usuário
    participant Hasher as Serviço de Hash
    participant TokenSvc as Serviço de Token

    Client->>LoginController: POST /auth/login (email, password)
    activate LoginController

    LoginController->>LoginUseCase: execute({ email, password })
    activate LoginUseCase

    LoginUseCase->>UserRepo: findByEmail(email)
    activate UserRepo
    UserRepo-->>LoginUseCase: Retorna o objeto User
    deactivate UserRepo

    alt Usuário não encontrado ou Senha incorreta
        LoginUseCase-->>LoginController: Lança AppError("Invalid credentials")
    end

    LoginUseCase->>Hasher: compare(password, user.password)
    activate Hasher
    Hasher-->>LoginUseCase: Retorna true
    deactivate Hasher

    LoginUseCase->>TokenSvc: generate({ sub: user.id, role: user.role })
    activate TokenSvc
    TokenSvc-->>LoginUseCase: Retorna o jwtToken
    deactivate TokenSvc

    LoginUseCase-->>LoginController: Retorna { token: jwtToken }
    deactivate LoginUseCase

    LoginController-->>Client: Resposta 200 OK com { token: jwtToken }
    deactivate LoginController
```
