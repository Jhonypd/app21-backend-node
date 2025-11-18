# Plano de Implementação: Arquitetura Completa Planning Poker

Este documento organiza as tarefas de implementação com base na especificação técnica fornecida, seguindo uma ordem lógica de dependências. O projeto será implementado utilizando o stack **Node.js/TypeScript + PostgreSQL + Prisma + Socket.IO** (com Redis opcional para Pub/Sub/locks).

## Fases de Implementação

A implementação será dividida em quatro fases principais, garantindo que a base de dados e o *backend* estejam sólidos antes de integrar o *real-time* e o *frontend*.

| Fase | Título | Objetivo Principal |
| :--- | :--- | :--- |
| **Fase 1** | **Infraestrutura e Modelo de Dados** | Configurar o ambiente, banco de dados e o modelo de dados Prisma. |
| **Fase 2** | **Backend REST e Lógica de Negócio** | Implementar a lógica transacional e os *endpoints* REST críticos. |
| **Fase 3** | **Real-Time (Socket.IO) e Sincronização** | Integrar o Socket.IO para comunicação em tempo real e sincronização de estado. |
| **Fase 4** | **Operacional, Segurança e Frontend** | Implementar recomendações de segurança, testes e padrões de UX/Frontend. |

---

## Detalhamento das Tarefas

### Fase 1: Infraestrutura e Modelo de Dados

**Objetivo:** Estabelecer a base de dados e o ORM (Prisma) com o modelo de dados completo.

| ID | Tarefa | Dependências | Entregável da Especificação |
| :--- | :--- | :--- | :--- |
| 1.1 | Configuração do Projeto Base | Nenhuma | Stack: Node.js/TS, Express/Fastify, PostgreSQL, Prisma. |
| 1.2 | Configuração do Banco de Dados | Nenhuma | PostgreSQL e `DATABASE_URL` configurados. |
| 1.3 | Implementação do Schema Prisma | Nenhuma | Seção 4: Schema Prisma. |
| 1.4 | Execução das Migrations Iniciais | 1.3 | Seção 8: Migrations SQL de exemplo (e outras necessárias). |
| 1.5 | Configuração de Autenticação (JWT) | 1.3 | Seção 4 (modelos `Pessoa`, `SessaoPessoa`, `RefreshToken`) e Seção 9 (Auth). |

### Fase 2: Backend REST e Lógica de Negócio

**Objetivo:** Implementar os serviços de domínio e os *endpoints* REST transacionais.

| ID | Tarefa | Dependências | Entregável da Especificação |
| :--- | :--- | :--- | :--- |
| 2.1 | Implementação do Serviço de Domínio `Sala` | 1.4 | Lógica para criar/buscar salas. |
| 2.2 | Implementação do Serviço de Domínio `Sessao` | 1.4 | Lógica para criar/gerenciar sessões. |
| 2.3 | Implementação do Serviço de Domínio `Voto` | 1.4 | Lógica para registrar/atualizar votos. |
| 2.4 | Implementação do Endpoint `GET /salas/:id` | 2.1, 2.2 | Seção 5: `GET /salas/:id`. |
| 2.5 | Implementação do Endpoint `POST /salas/:id/sessoes` | 2.2 | Seção 5: `POST /salas/:id/sessoes` e Seção 7.1 (Fluxo Transacional). |
| 2.6 | Implementação do Endpoint `POST /sessoes/:id/participantes` | 2.2 | Seção 5: `POST /sessoes/:id/participantes` e Seção 7.2 (Fluxo Transacional). |
| 2.7 | Implementação do Endpoint `POST /sessoes/:id/votos` | 2.3 | Seção 5: `POST /sessoes/:id/votos` e Seção 7.3 (Fluxo Transacional). |
| 2.8 | Implementação do Endpoint `POST /sessoes/:id/revelar` | 2.1, 2.3 | Seção 5: `POST /sessoes/:id/revelar` e Seção 7.4 (Fluxo Transacional). |
| 2.9 | Implementação do Endpoint `POST /sessoes/:id/resetar` | 2.2, 2.3 | Seção 5: `POST /sessoes/:id/resetar`. |
| 2.10 | Implementação de Locks Transacionais | 2.5, 2.7, 2.8 | Seção 7 (Nota sobre locks) e Seção 9 (Redis). |

### Fase 3: Real-Time (Socket.IO) e Sincronização

**Objetivo:** Configurar o servidor Socket.IO e integrar a emissão de eventos com a lógica de negócio.

| ID | Tarefa | Dependências | Entregável da Especificação |
| :--- | :--- | :--- | :--- |
| 3.1 | Configuração do Servidor Socket.IO | 1.1 | Seção 2 (Diagrama) e Seção 6 (Eventos). |
| 3.2 | Integração do Pub/Sub com Redis | 3.1 | Seção 9 (Redis) para comunicação entre instâncias. |
| 3.3 | Implementação da Autenticação no Handshake WS | 1.5, 3.1 | Seção 9 (Auth). |
| 3.4 | Emissão do Evento `sessao:criada` | 2.5, 3.1 | Seção 6. |
| 3.5 | Emissão do Evento `participante:adicionado` | 2.6, 3.1 | Seção 6. |
| 3.6 | Emissão do Evento `voto:adicionado` | 2.7, 3.1 | Seção 6. |
| 3.7 | Emissão do Evento `votos:revelados` | 2.8, 3.1 | Seção 6. |
| 3.8 | Emissão do Evento `votos:resetados` | 2.9, 3.1 | Seção 6. |
| 3.9 | Emissão do Evento `sala:atualizada` | 3.4, 3.7, 3.8 | Seção 6 (Regra prática). |
| 3.10 | Gerenciamento de Conexão/Desconexão | 3.1 | Eventos `participante:conexao` / `participante:desconexao` (Seção 6). |

### Fase 4: Operacional, Segurança e Frontend

**Objetivo:** Finalizar a implementação com testes, segurança e a lógica de consumo no *frontend*.

| ID | Tarefa | Dependências | Entregável da Especificação |
| :--- | :--- | :--- | :--- |
| 4.1 | Implementação de Testes de Integração (Backend) | 2.1 a 2.9 | Seção 9 (Testes). |
| 4.2 | Implementação de Testes de Concorrência | 2.10, 4.1 | Seção 9 (Testes). |
| 4.3 | Implementação de Rate-Limit | 2.7 | Seção 9 (Rate-limit). |
| 4.4 | Implementação de Logs e Auditoria | 2.5, 2.8, 2.9 | Seção 9 (Logs/audit). |
| 4.5 | Configuração de Monitoramento | 3.1 | Seção 9 (Monitoramento). |
| 4.6 | Desenvolvimento do Frontend (Next.js/React) | 2.4, 3.1 | Seção 10 (Padrões UX/Front-end). |
| 4.7 | Implementação da Lógica de Sincronização no Front | 3.9 | Seção 10 (Usar `sala:atualizada` como fonte de verdade). |
| 4.8 | Implementação da UI Otimista para Votos | 4.6 | Seção 10 (Otimistic UI). |

---

## Próximos Passos Sugeridos

A especificação técnica já lista alguns artefatos que podem ser gerados imediatamente. Para iniciar a implementação, o passo mais lógico é começar pela **Fase 1**.

**Sugestão de Próximo Artefato a ser Gerado:**

1.  **Migrations SQL completas** (para configurar o banco de dados).
2.  **Handlers Node/TS** para os *endpoints* críticos (para iniciar o desenvolvimento do *backend*).

Qual artefato você gostaria que eu gerasse primeiro?
