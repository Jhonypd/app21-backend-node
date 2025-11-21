# 🔄 Alterações Propostas - Sistema de Tipos de Acesso (4 Níveis)

## 📋 Análise da Situação Atual vs. Requisitos

### ✅ O que já existe e está correto:

1. **Estrutura de banco** - Prisma schema está adequado:

   - `ParticipanteSala` - Para participantes PERMANENTES (tipos 0, 1 e 2)
   - `ParticipanteSessao` - Para TODOS os participantes ativos em uma sessão
   - Campo `membro_permanente` em `ParticipanteSala` - diferencia permanentes de temporários
   - Campo `autorizado` em `ParticipanteSessao` - controle fino de permissões
   - **NOVO:** Campo `role` em `ParticipanteSala` - diferencia níveis de acesso (0, 1, 2)

2. **Repositories básicos** - Funcionam mas precisam de ajustes
3. **JWT e tokens** - Sistema de autenticação por sala existe

### 🔑 Conceito Fundamental CORRIGIDO (4 NÍVEIS):

**TODOS os tipos de usuários têm `ParticipanteSessao` quando estão em uma sessão:**

- **Tipo 0 (Dono/Owner)**: `ParticipanteSala` (role=0) + `ParticipanteSessao` (na sessão ativa)
- **Tipo 1 (Administrador)**: `ParticipanteSala` (role=1) + `ParticipanteSessao` (na sessão ativa)
- **Tipo 2 (Participante Fixo)**: `ParticipanteSala` (role=2) + `ParticipanteSessao` (na sessão ativa)
- **Tipo 3 (Visitante)**: SEM `ParticipanteSala` + `ParticipanteSessao` (apenas naquela sessão)

**A diferença NÃO é quem tem `ParticipanteSessao`, mas sim:**

- **Permanentes (0, 1, 2)**: Têm `ParticipanteSala` com `role` específico → podem entrar em todas as sessões
- **Temporários (3)**: Sem `ParticipanteSala` → só entram se autorizados naquela sessão específica

## 🎭 Níveis de Acesso Detalhados

### **Tipo 0 - Dono (Owner)**

👑 **Criador da sala - Poder total**

**Permissões Exclusivas:**

- ✅ Transferir propriedade da sala para outro membro
- ✅ Excluir a sala permanentemente
- ✅ Promover participantes a Administrador (role 1)
- ✅ Rebaixar Administradores a Participante Fixo (role 2)
- ✅ Alterar configurações sensíveis da sala (nome, privacidade, senha)
- ✅ Visualizar histórico completo de auditoria da sala

**Permissões Compartilhadas com Admin:**

- ✅ Criar/encerrar sessões
- ✅ Adicionar/remover visitantes temporários
- ✅ Adicionar/remover participantes fixos
- ✅ Criar/editar/excluir histórias
- ✅ Revelar/ocultar votos
- ✅ Selecionar história atual para votação
- ✅ Kickar participante da sessão ativa

**Características:**

- Único por sala (criador)
- Não pode ser removido da sala
- Sempre `membro_permanente = true` e `role = 0`

---

### **Tipo 1 - Administrador (Admin)**

⚡ **Co-gerente da sala - Quase poder total**

**Permissões:**

- ✅ **Gerenciar Sessões**: Criar, iniciar e encerrar sessões
- ✅ **Gerenciar Visitantes**: Adicionar/remover visitantes temporários da sessão
- ✅ **Gerenciar Participantes Fixos**: Adicionar/remover participantes fixos (role 2)
- ✅ **Gerenciar Histórias**: Criar, editar, excluir e importar histórias (CSV)
- ✅ **Controlar Votação**: Revelar/ocultar votos, selecionar história atual
- ✅ **Moderar Sessão**: Kickar participante problemático da sessão ativa
- ✅ **Visualizar Estatísticas**: Acessar métricas e histórico de sessões
- ✅ **Editar Configurações Básicas**: Alterar nome da sala (não senha/privacidade)

**Limitações:**

- ❌ Não pode excluir a sala
- ❌ Não pode transferir propriedade
- ❌ Não pode promover outros a Admin (só dono pode)
- ❌ Não pode alterar senha ou privacidade da sala
- ❌ Não pode remover o dono ou outros admins

**Características:**

- Múltiplos admins permitidos por sala
- Sempre `membro_permanente = true` e `role = 1`
- Promovido pelo dono (tipo 0)

**Casos de Uso Realistas:**

- Scrum Master em equipe ágil
- Tech Lead que ajuda a gerenciar planning
- Product Owner que modera sessões
- Facilitador de cerimônias

---

### **Tipo 2 - Participante Fixo (Membro)**

👤 **Membro permanente da equipe**

**Permissões:**

- ✅ **Entrar em qualquer sessão**: Acesso automático quando sessão está ativa
- ✅ **Votar**: Registrar estimativas nas histórias
- ✅ **Criar Histórias**: Adicionar novas user stories (se permitido pelo dono/admin)
- ✅ **Visualizar Histórico**: Ver histórias e sessões anteriores
- ✅ **Comentar**: Participar de discussões (se implementado)
- ✅ **Ver Estatísticas Pessoais**: Suas próprias métricas de participação

**Limitações:**

- ❌ Não pode gerenciar sessões
- ❌ Não pode adicionar/remover outros participantes
- ❌ Não pode revelar votos
- ❌ Não pode kickar ninguém
- ❌ Não pode editar/excluir histórias de outros
- ❌ Não pode alterar configurações da sala

**Características:**

- Sempre `membro_permanente = true` e `role = 2`
- Adicionado por dono ou admin
- Permanece entre sessões

**Casos de Uso Realistas:**

- Desenvolvedores da equipe
- QA/Testers
- Designers
- Membros regulares do time

---

### **Tipo 3 - Visitante (Guest)**

🚶 **Participante temporário - Apenas para esta sessão**

**Permissões:**

- ✅ **Votar**: Pode registrar estimativas (se autorizado)
- ✅ **Visualizar**: Ver histórias e votos da sessão atual
- ✅ **Participar**: Interagir durante a sessão ativa

**Limitações:**

- ❌ Não pode entrar sem ser convidado pelo dono/admin
- ❌ Não tem acesso a histórico de outras sessões
- ❌ Não pode criar histórias
- ❌ Perde acesso quando sessão encerra
- ❌ Não pode ver configurações da sala
- ❌ Pode ter voto apenas "consultivo" (não conta no consenso)

**Características:**

- Sem `ParticipanteSala` (não é permanente)
- Tem `ParticipanteSessao` apenas na sessão atual
- Adicionado por dono ou admin ao criar/durante sessão
- `autorizado = false` por padrão (voto consultivo)

**Casos de Uso Realistas:**

- Stakeholder externo observando planning
- Cliente que quer acompanhar estimativas
- Novo membro em período de experiência
- Consultor/Freelancer temporário
- Auditor/Observador

### ❌ Problemas Identificados

#### 1. **`entrarSala` não segue as regras dos 4 tipos**

**Problema atual:**

- Lógica confusa entre criador, participante e visitante
- Cria sessão quando já existe uma ativa (corrigido)
- Não valida corretamente o tipo de acesso
- Não diferencia entre Admin (1) e Participante Fixo (2)

**O que deveria fazer:**

**TIPO 0 (Dono):**

- ✅ Pode entrar sempre sem senha
- ❌ **FALTA:** Se não houver sessão ativa, deve criar automaticamente
- ❌ **FALTA:** Ao criar sessão, criar `ParticipanteSessao` para TODOS os `ParticipanteSala` da sala
- ❌ **FALTA:** Opcionalmente aceitar lista de IDs de visitantes para criar `ParticipanteSessao` temporários
- ✅ Marca `ParticipanteSala.online = true` (já faz)

**TIPO 1 (Administrador):**

- ✅ Valida senha se sala tiver senha
- ❌ **FALTA:** Verificar se existe `ParticipanteSala` com `role = 1`
- ❌ **FALTA:** Pode criar sessão se não existir (mesmo poder do dono)
- ❌ **FALTA:** Criar `ParticipanteSessao` automaticamente ao entrar
- ✅ Marca `ParticipanteSala.online = true`

**TIPO 2 (Participante Fixo):**

- ✅ Valida senha se sala tiver senha
- ❌ **FALTA:** Verificar se existe `ParticipanteSala` com `role = 2`
- ❌ **FALTA:** Verificar se existe sessão ativa antes de permitir entrada
- ❌ **FALTA:** Bloquear entrada se não houver sessão ativa
- ❌ **FALTA:** Criar/atualizar `ParticipanteSessao` automaticamente ao entrar
- ✅ Marca `ParticipanteSala.online = true`

**TIPO 3 (Visitante):**

- ❌ **PROBLEMA:** Código atual bloqueia com `throw` antes de chegar nesse tipo
- ❌ **FALTA:** Verificar se existe `ParticipanteSessao` na sessão ATIVA (criado pelo dono/admin previamente)
- ❌ **FALTA:** Validar senha se sala tiver senha
- ❌ **FALTA:** Bloquear se não existir `ParticipanteSessao` para ele
- ✅ **CORRETO:** Não deve criar registro em `ParticipanteSala` (é temporário)

---

#### 2. **Falta parâmetro na criação de sessão para adicionar visitantes**

**O que falta:**

**Opção A - Ao criar sessão (preferível):**

```
POST /salas/:id/entrar
Body: {
  codigo: string,
  senha?: string,
  visitantes?: string[] // IDs dos visitantes temporários
}
```

**Opção B - Rota separada:**

```
POST /salas/:salaId/sessoes/autorizar-visitantes
Body: { pessoa_ids: string[] }
```

**Lógica:**

- Apenas dono pode chamar
- Quando sessão é criada:
  1. Cria `SessaoSala`
  2. Cria `ParticipanteSessao` para TODOS os `ParticipanteSala` da sala (permanentes)
  3. Se `visitantes[]` foi passado, cria `ParticipanteSessao` para cada ID (temporários)
- Retorna sucesso

---

#### 3. **Falta rota para DONO/ADMIN adicionar PARTICIPANTES**

**O que falta:**

```
POST /salas/:salaId/participantes
Body: {
  pessoa_id: string,
  role: 1 | 2  // 1 = Admin, 2 = Participante Fixo
}
```

**Permissões:**

- Dono (0) pode adicionar com role 1 ou 2
- Admin (1) pode adicionar apenas com role 2
- Cria `ParticipanteSala` com `membro_permanente = true` e `role` especificado
- Retorna sucesso

---

#### 4. **Falta rota para DONO/ADMIN remover VISITANTE da sessão**

**O que falta:**

```
DELETE /salas/:salaId/sessoes/visitantes/:pessoaId
```

**Permissões:**

- Dono (0) e Admin (1) podem remover visitantes
- Remove ou marca `autorizado = false` em `ParticipanteSessao`
- Socket deve desconectar o visitante (implementar depois)

---

#### 5. **Service `sessaoSalaService.criarSessao` não segue regra**

**Problema:**

- Qualquer pessoa pode chamar (se tiver rota exposta)
- Deveria ser chamada APENAS:
  - Automaticamente quando dono (0) ou admin (1) entra e não há sessão ativa
  - Via rota explícita apenas por dono ou admin

**Correção:**

- Validar que `pessoa_id` tem `role = 0` ou `role = 1`
- Garantir que só é chamada no contexto correto

---

#### 6. **Falta helper para determinar tipo de acesso (4 NÍVEIS)**

**O que criar:**

```typescript
// src/helpers/determinar-tipo-acesso.ts
export async function determinarTipoAcesso(
  sala: Sala,
  pessoaId: string
): Promise<0 | 1 | 2 | 3 | null>;
```

**Lógica ATUALIZADA (4 NÍVEIS):**

1. Se `sala.criado_por === pessoaId` → retorna `0` (Dono)
2. Se existe `ParticipanteSala` com `role = 1` → retorna `1` (Administrador)
3. Se existe `ParticipanteSala` com `role = 2` → retorna `2` (Participante Fixo)
4. Se existe `ParticipanteSessao` na sessão ativa (sem ter `ParticipanteSala`) → retorna `3` (Visitante)
5. Caso contrário → retorna `null` (Sem acesso)

**Importante:**

- Tipos 0, 1, 2 são permanentes (têm `ParticipanteSala`)
- Tipo 3 é temporário (apenas `ParticipanteSessao`)
- `role` em `ParticipanteSala` diferencia Admin (1) de Membro (2)

---

#### 7. **Falta validação de permissões nas rotas (4 NÍVEIS)**

**Criar middleware:**

```typescript
// src/middlewares/salaPermissaoGuard.ts
export const salaPermissaoGuard = (tiposPermitidos: (0 | 1 | 2 | 3)[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Lê role do token JWT da sala (req.sala?.Role)
    // Se role não está em tiposPermitidos, retorna 403
    // Caso contrário, next()
  };
};
```

**Exemplos de Uso:**

```typescript
// Apenas dono
router.delete(
  "/:id",
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0]),
  salaController.deletar
);

// Dono e admin
router.post(
  "/:id/sessoes",
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  sessaoSalaController.criar
);

// Dono, admin e participantes fixos
router.post(
  "/:id/historias",
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2]),
  historiaController.criar
);

// Todos (incluindo visitantes)
router.post(
  "/:id/votos",
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  votoController.votar
);
```

---

## 🛠️ Plano de Implementação (4 NÍVEIS)

### **Fase 1: Adicionar campo `role` ao banco de dados**

1. Atualizar schema Prisma:

```prisma
model ParticipanteSala {
  // ... campos existentes
  role Int @default(2) // 0=Dono, 1=Admin, 2=Membro (padrão)
  @@index([role])
}
```

2. Criar migration:

```bash
npx prisma migrate dev --name add_role_to_participante_sala
```

### **Fase 2: Corrigir `criarSessao` e `entrarSala` (CRÍTICO)**

1. Criar helper `determinarTipoAcesso` (retorna 0 | 1 | 2 | 3 | null)
2. Modificar `sessaoSalaService.criarSessao`:
   - Validar que quem chama tem `role = 0` ou `role = 1`
   - Criar `SessaoSala`
   - Criar `ParticipanteSessao` automaticamente para TODOS os `ParticipanteSala` da sala
   - Aceitar parâmetro opcional `visitantes: string[]`
   - Criar `ParticipanteSessao` para cada visitante (sem criar `ParticipanteSala`)
3. Reescrever lógica de `entrarSala`:
   - Buscar sala
   - Determinar tipo de acesso (0, 1, 2, 3, null)
   - Validar senha conforme tipo
   - **Tipo 0 (Dono):** Se não há sessão, criar (com visitantes opcionais)
   - **Tipo 1 (Admin):** Se não há sessão, criar (com visitantes opcionais)
   - **Tipo 1:** Validar que sessão existe, criar/atualizar `ParticipanteSessao`
   - **Tipo 2:** Validar que sessão existe E que `ParticipanteSessao` já foi criado (pelo dono)
   - Marcar `ParticipanteSala.online = true` para tipos 0 e 1
   - Gerar token com role correto

### **Fase 2: Criar rotas de gerenciamento (DONO)**

1. `POST /salas/:id/participantes` - Adicionar participante fixo
2. `POST /salas/:id/sessoes/autorizar-visitante` - Autorizar visitante
3. `DELETE /salas/:id/sessoes/remover-visitante/:pessoaId` - Remover visitante
4. `DELETE /salas/:id/participantes/:pessoaId` - Remover participante fixo

### **Fase 3: Criar middleware de permissões**

1. `salaPermissaoGuard([0])` - Apenas dono
2. `salaPermissaoGuard([0, 1])` - Dono e participantes fixos
3. Aplicar em todas as rotas sensíveis

### **Fase 4: Ajustar controllers e services**

1. Criar `sessaoSalaController.autorizarVisitante`
2. Criar `sessaoSalaController.removerVisitante`
3. Criar `participanteSalaController.adicionarParticipante`
4. Criar `participanteSalaController.removerParticipante`
5. Criar services correspondentes

### **Fase 5: Melhorias adicionais**

1. Endpoint para listar participantes online/offline
2. Endpoint para listar visitantes autorizados na sessão
3. Validações de histórias (quem pode criar/editar)

---

## 📝 Código das Alterações Principais

## 📊 Matriz de Permissões por Funcionalidade

| Funcionalidade                                      | Dono (0) | Admin (1) | Membro (2) | Visitante(3) |
| --------------------------------------------------- | :------: | :-------: | :--------: | :----------: |
| **Gerenciamento de Sala**                           |
| Excluir sala†                                       |    ✅    |    ❌     |     ❌     |      ❌      |
| Transferir propriedade‡                             |    ✅    |    ❌     |     ❌     |      ❌      |
| Alterar nome da sala                                |    ✅    |    ✅     |     ❌     |      ❌      |
| Alterar senha/privacidade                           |    ✅    |    ❌     |     ❌     |      ❌      |
| Alterar status de atividade                         |    ✅    |    ❌     |     ❌     |      ❌      |
| **Gerenciamento de Usuários**                       |
| Promover a Admin (role 1)                           |    ✅    |    ❌     |     ❌     |      ❌      |
| Rebaixar Admin (role 1→2)                           |    ✅    |    ❌     |     ❌     |      ❌      |
| Adicionar Membro Fixo (role 2)                      |    ✅    |    ✅     |     ❌     |      ❌      |
| Remover Membro Fixo                                 |    ✅    |    ✅     |     ❌     |      ❌      |
| Adicionar Visitante (tipo 3)                        |    ✅    |    ✅     |     ❌     |      ❌      |
| Remover Visitante                                   |    ✅    |    ✅     |     ❌     |      ❌      |
| **Gerenciamento de SessãoSala§**                    |
| Criar sessãoSala                                    |    ✅    |    ✅     |     ❌     |      ❌      |
| Encerrar sessãoSala                                 |    ✅    |    ✅     |     ❌     |      ❌      |
| **Gerenciamento de ParticipanteSessão¶**            |
| Entrar em sessão (criar próprio ParticipanteSessão) |    ✅    |    ✅     |     ✅     |     ⚠️\*     |
| Sair da sessão (remover próprio ParticipanteSessão) |    ✅    |    ✅     |     ✅     |      ✅      |
| **Histórias**                                       |
| Criar história                                      |    ✅    |    ✅     |     ❌     |      ❌      |
| Editar história                                     |    ✅    |    ✅     |     ❌     |      ❌      |
| Excluir história                                    |    ✅    |    ✅     |     ❌     |      ❌      |
| Importar CSV                                        |    ✅    |    ✅     |     ❌     |      ❌      |
| **Votação**                                         |
| Votar                                               |    ✅    |    ✅     |     ✅     |      ✅      |
| Revelar votos                                       |    ✅    |    ✅     |     ❌     |      ❌      |
| Selecionar história atual                           |    ✅    |    ✅     |     ❌     |      ❌      |
| Resetar votação                                     |    ✅    |    ✅     |     ❌     |      ❌      |
| **Moderação**                                       |
| Kickar participante da sessão                       |    ✅    |    ✅     |     ❌     |      ❌      |
| **Visualização**                                    |
| Ver histórias                                       |    ✅    |    ✅     |     ✅     |      ✅      |
| Ver votos (revelados)                               |    ✅    |    ✅     |     ✅     |      ✅      |
| Ver estatísticas                                    |    ✅    |    ✅     |     ✅     |      ❌      |
| Ver histórico de sessões                            |    ✅    |    ✅     |     ✅     |      ❌      |
| Ver auditoria completa                              |    ✅    |    ❌     |     ❌     |      ❌      |

**Legenda:**

- **†** Sala só pode ser excluída se NÃO houver sessões criadas E NÃO houver votos registrados
  - Exclusão é **LÓGICA** (campo `inativo = true` no schema)
  - Validações necessárias: `contarSessoesPorSala()` e `contarVotosPorSala()`
- **‡** Transferência de propriedade:
  - Só pode transferir para pessoas que já são ParticipanteSala (membros ativos)
  - Dono atual automaticamente vira ParticipanteSala (role 2) após transferência
  - Dono não pode ser removido diretamente durante o processo de transferência
- **§** SessãoSala = Sessão da sala (criada/encerrada apenas por admin/dono)
- **¶** ParticipanteSessão = Participação individual em uma sessão (todos gerenciam a própria)
- **⚠️\*** Visitante só entra se convidado/autorizado pelo Dono/Admin

---

## 🚨 FLUXO CRÍTICO: Autorização e Moderação (Kick)

### **Como funciona o sistema de autorização:**

#### **1. Criação de Sessão (Admin/Dono):**

```typescript
// Quando admin ou dono CRIA uma sessãoSala:
1. Cria SessaoSala (ativa = true)
2. Cria ParticipanteSessao para TODOS os ParticipanteSala (autorizado = true)
3. Se enviou IDs de visitantes, cria ParticipanteSessao para eles (autorizado = true)
```

#### **2. Sistema de Kick (Admin/Dono):**

```typescript
// Kick = UPDATE ParticipanteSessao.autorizado = false
PATCH /salas/:salaId/sessoes/:sessaoId/participantes/:pessoaId/kick

// IMPORTANTE:
- Admin NÃO pode kickar Dono (role 0)
- Dono pode kickar qualquer um (incluindo admins)
- Kick é por SESSÃO (não remove ParticipanteSala)
- Participante kickado perde acesso MESMO sendo ParticipantePermanente
```

#### **3. Validação OBRIGATÓRIA no salaAuthGuard:**

```typescript
// src/middlewares/salaAuthGuard.ts
export async function salaAuthGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tokenSala = req.headers["x-token-sala"];

    if (!tokenSala) {
      return res.status(401).json({ erro: "Token da sala não fornecido" });
    }

    // Decodificar JWT
    const decoded = jwt.verify(tokenSala, process.env.JWT_SECRET) as {
      sessao_id: string;
      sala_id: string;
      pessoa_id: string;
      role: 0 | 1 | 2 | 3;
    };

    // VALIDAÇÃO CRÍTICA #1: Verificar se sessão ainda está ativa
    const sessao = await sessaoSalaRepository.obterPorId(decoded.sessao_id);
    if (!sessao || !sessao.ativa) {
      return res.status(403).json({
        erro: "Sessão encerrada ou inválida",
        limpar_token: true, // Frontend deve limpar tokenSala
      });
    }

    // VALIDAÇÃO CRÍTICA #2: Verificar se pessoa tem ParticipanteSessao
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        decoded.sessao_id,
        decoded.pessoa_id
      );

    if (!participanteSessao) {
      return res.status(403).json({
        erro: "Você não está mais nesta sessão",
        limpar_token: true, // Frontend deve limpar tokenSala
      });
    }

    // VALIDAÇÃO CRÍTICA #3: Verificar se está autorizado
    if (!participanteSessao.autorizado) {
      return res.status(403).json({
        erro: "Você foi removido desta sessão (kick)",
        limpar_token: true, // Frontend deve limpar tokenSala
      });
    }

    // Anexar informações ao request
    req.sala = {
      id: decoded.sala_id,
      sessao_id: decoded.sessao_id,
      pessoa_id: decoded.pessoa_id,
      Role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      erro: "Token inválido",
      limpar_token: true,
    });
  }
}
```

#### **4. Comportamento do Frontend:**

```typescript
// Quando receber response com limpar_token: true
if (response.data.limpar_token) {
  dispatch(clearSalaToken()); // Limpar Redux
  // Redirecionar para lista de salas ou mostrar modal
}
```

#### **5. Socket.IO (Futuro):**

```typescript
// Quando implementar WebSocket, kick será em tempo real:
socket.emit("participante_kickado", {
  pessoa_id: kickedUserId,
  sessao_id: sessaoId,
  motivo: "Removido pelo administrador",
});

// Frontend recebe e limpa token automaticamente:
socket.on("participante_kickado", (data) => {
  if (data.pessoa_id === meuUserId) {
    dispatch(clearSalaToken());
    toast.error("Você foi removido da sessão");
    router.push("/salas");
  }
});
```

### **Resumo das Validações:**

| Validação                             | Local          | Ação em Falha         |
| ------------------------------------- | -------------- | --------------------- |
| Sessão ativa?                         | salaAuthGuard  | 403 + limpar_token    |
| ParticipanteSessao existe?            | salaAuthGuard  | 403 + limpar_token    |
| ParticipanteSessao.autorizado = true? | salaAuthGuard  | 403 + limpar_token    |
| Admin tentando kickar dono?           | kickController | 403 + erro específico |

---

## 📝 Código das Alterações Principais

### 1. Helper `determinarTipoAcesso` (4 NÍVEIS)

```typescript
// src/helpers/determinar-tipo-acesso.ts
import { participanteSalaRepository } from "../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../repositories/participante-sessao.repository";

interface Sala {
  id: string;
  criado_por: string;
  sessoes?: { id: string; ativa: boolean }[];
}

export async function determinarTipoAcesso(
  sala: Sala,
  pessoaId: string
): Promise<0 | 1 | 2 | 3 | null> {
  // TIPO 0: Dono (criador da sala)
  if (sala.criado_por === pessoaId) {
    return 0;
  }

  // Buscar ParticipanteSala
  const participanteSala = await participanteSalaRepository.obterPorSalaEPessoa(
    sala.id,
    pessoaId
  );

  // TIPO 1: Administrador (role = 1)
  if (participanteSala && participanteSala.role === 1) {
    return 1;
  }

  // TIPO 2: Participante Fixo/Membro (role = 2)
  if (participanteSala && participanteSala.role === 2) {
    return 2;
  }

  // TIPO 3: Visitante (tem ParticipanteSessao mas NÃO tem ParticipanteSala)
  const sessaoAtiva = sala.sessoes?.find((s) => s.ativa);
  if (sessaoAtiva && !participanteSala) {
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoaId
      );

    // Visitante = tem ParticipanteSessao MAS não tem ParticipanteSala
    if (participanteSessao && !participanteSala) {
      return 2;
    }
  }

  // Sem acesso
  return null;
}
```

### 2. Reescrita de `criarSessao` (CORRIGIDA)

```typescript
// Em sessaoSalaService
async criarSessao(sala_id: string, pessoa_id: string, visitantes?: string[]) {
  // Verificar se a sala existe e se o usuário tem permissão (deve ser dono)
  const sala = await salaRepository.obterPorId(sala_id, false, pessoa_id);
  if (!sala || sala.criado_por !== pessoa_id) {
    throw new Error("Apenas o dono pode criar sessão.");
  }

  // Desativar sessões ativas anteriores da sala
  await sessaoSalaRepository.desativarSessoesPorSala(sala_id);

  // Criar nova sessão
  const novaSessao = await sessaoSalaRepository.inserir({ sala_id });

  // 1. Criar ParticipanteSessao para TODOS os ParticipanteSala (permanentes)
  const participantesSala = await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);

  for (const participante of participantesSala) {
    await participanteSessaoRepository.inserir({
      sessao_id: novaSessao.id,
      pessoa_id: participante.pessoa_id,
      autorizado: participante.pessoa_id === sala.criado_por, // Dono autorizado, outros não
    });
  }

  // 2. Criar ParticipanteSessao para visitantes temporários (se fornecidos)
  if (visitantes && visitantes.length > 0) {
    for (const visitanteId of visitantes) {
      // Verificar se não é participante permanente
      const jaEhPermanente = participantesSala.find(p => p.pessoa_id === visitanteId);

      if (!jaEhPermanente) {
        await participanteSessaoRepository.inserir({
          sessao_id: novaSessao.id,
          pessoa_id: visitanteId,
          autorizado: false, // Visitantes não autorizados por padrão
        });
      }
    }
  }

  return novaSessao;
}
```

### 3. Reescrita de `entrarSala` (CORRIGIDA)

```typescript
async entrarSala(
  codigo: string,
  pessoaId: string,
  sessaoPessoaId: string,
  senha?: string,
  visitantes?: string[] // Apenas para dono ao criar sessão
) {
  // Validações iniciais
  if (!pessoaId) throw new Error("Id da pessoa não fornecido.");
  if (!codigo) throw new Error("Código da sala não fornecido.");
  if (!sessaoPessoaId) throw new Error("Id da sessão do usuário não fornecido.");

  // Buscar sala com sessões ativas
  const sala = await salaRepository.obterPorCodigo(codigo, true, undefined);
  if (!sala) {
    throw new Error("Sala não encontrada.");
  }

  // Determinar tipo de acesso
  const tipoAcesso = await determinarTipoAcesso(sala, pessoaId);

  if (tipoAcesso === null) {
    throw new Error("Você não tem permissão para acessar esta sala.");
  }

  // Validar senha (exceto para dono)
  if (sala.senha && tipoAcesso !== 0) {
    if (!senha) {
      throw new Error("Informe a senha para acessar a sala.");
    }
    const senhaValida = await hash.compare(senha, sala.senha);
    if (!senhaValida) {
      throw new Error("Senha informada inválida.");
    }
  }

  // Obter sessão ativa
  let sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(sala.id, pessoaId);

  // TIPO 0 (Dono): Cria sessão se não existir
  if (tipoAcesso === 0) {
    if (!sessaoAtiva) {
      // Criar sessão e ParticipanteSessao para todos (permanentes + visitantes opcionais)
      const novaSessao = await sessaoSalaService.criarSessao(sala.id, pessoaId, visitantes);
      sessaoAtiva = novaSessao;
    }
    // ParticipanteSessao já foi criado automaticamente em criarSessao

    // Marca como online em ParticipanteSala
    const participanteSala = await participanteSalaRepository.obterPorSalaEPessoa(sala.id, pessoaId);
    if (participanteSala) {
      await participanteSalaRepository.alterarParticipanteSalaOnline(sala.id, pessoaId, true);
    }
  }

  // TIPO 1 (Participante Fixo): Requer sessão ativa
  else if (tipoAcesso === 1) {
    if (!sessaoAtiva || !sessaoAtiva.ativa) {
      throw new Error("Não há sessão ativa no momento. Aguarde o dono abrir a sessão.");
    }

    // ParticipanteSessao já foi criado automaticamente quando sessão foi aberta
    // Apenas marca como online
    await participanteSalaRepository.alterarParticipanteSalaOnline(sala.id, pessoaId, true);
  }

  // TIPO 2 (Visitante): Requer sessão ativa E ParticipanteSessao pré-existente
  else if (tipoAcesso === 2) {
    if (!sessaoAtiva || !sessaoAtiva.ativa) {
      throw new Error("Não há sessão ativa no momento.");
    }

    // Visitante já tem ParticipanteSessao (criado pelo dono)
    // Validado em determinarTipoAcesso - se chegou aqui, tem permissão
    // Não marca online em ParticipanteSala pois visitante não tem
  }

  // Buscar informações da pessoa
  const pessoa = await pessoaRepository.obterPorId(pessoaId, false);
  if (!pessoa) throw new Error("Pessoa não encontrada.");

  // Gerar token
  const dataExpiracao = addHours(new Date(), 6);
  const nomeDescriptografado = await criptografia.descriptografar(pessoa.nome);

  const tokenPayload: ClaimsAuthSala = {
    Role: tipoAcesso,
    Usu_Id: pessoaId,
    Usu_Na: nomeDescriptografado,
    Sala_Id: sala.id,
    Sala_titulo: sala.titulo,
    Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
    Ss_Id: sessaoPessoaId,
  };

  const tokenSala = geradorTokenSala(tokenPayload);

  return { tokenSala, dataExpiracao: tokenPayload.Dt_Ex, role: tipoAcesso };
}
```

### 3. Middleware `salaPermissaoGuard`

```typescript
// src/middlewares/salaPermissaoGuard.ts
import { Request, Response, NextFunction } from "express";
import { respostaErro } from "../utils/response";

export const salaPermissaoGuard = (tiposPermitidos: (0 | 1 | 2)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.Role;

    if (userRole === undefined || !tiposPermitidos.includes(userRole)) {
      return res.status(403).json(
        respostaErro({
          mensagem: "Você não tem permissão para executar esta ação.",
        })
      );
    }

    next();
  };
};
```

### 4. Novos controllers (CORRIGIDOS)

```typescript
// Adicionar em sessaoSalaController
async adicionarVisitantes(req: Request, res: Response) {
  try {
    const sala_id = req.params.id;
    const { pessoa_ids } = req.body; // Array de IDs
    const dono_id = req.user?.Usu_Id as string;

    const participantes = await sessaoSalaService.adicionarVisitantes(
      sala_id,
      pessoa_ids,
      dono_id
    );

    res.json(
      respostaSucesso({
        resultado: { participantes },
        mensagem: "Visitantes adicionados com sucesso.",
      })
    );
  } catch (error: any) {
    res.status(500).json(respostaErro({ mensagem: error.message }));
  }
}

async removerVisitante(req: Request, res: Response) {
  try {
    const sala_id = req.params.id;
    const pessoa_id = req.params.pessoaId;
    const dono_id = req.user?.Usu_Id as string;

    await sessaoSalaService.removerVisitante(sala_id, pessoa_id, dono_id);

    res.json(
      respostaSucesso({
        mensagem: "Visitante removido com sucesso.",
      })
    );
  } catch (error: any) {
    res.status(500).json(respostaErro({ mensagem: error.message }));
  }
}
```

### 5. Novos services (CORRIGIDOS)

```typescript
// Adicionar em sessaoSalaService
async adicionarVisitantes(sala_id: string, pessoa_ids: string[], dono_id: string) {
  // Verificar se quem está chamando é o dono
  const sala = await salaRepository.obterPorId(sala_id, false, dono_id);
  if (!sala || sala.criado_por !== dono_id) {
    throw new Error("Apenas o dono da sala pode adicionar visitantes.");
  }

  // Verificar se há sessão ativa
  const sessaoAtiva = await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
  if (!sessaoAtiva) {
    throw new Error("Não há sessão ativa para adicionar visitantes.");
  }

  // Buscar participantes permanentes para evitar duplicação
  const permanentes = await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);
  const idsPermantentes = permanentes.map(p => p.pessoa_id);

  const participantesCriados = [];

  for (const pessoaId of pessoa_ids) {
    // Não criar se já é participante permanente
    if (idsPermantentes.includes(pessoaId)) {
      continue;
    }

    // Verificar se já existe ParticipanteSessao
    const jaExiste = await participanteSessaoRepository.obterPorSessaoEPessoa(
      sessaoAtiva.id,
      pessoaId
    );

    if (!jaExiste) {
      const participante = await participanteSessaoRepository.inserir({
        sessao_id: sessaoAtiva.id,
        pessoa_id: pessoaId,
        autorizado: false, // Visitantes não autorizados por padrão
      });
      participantesCriados.push(participante);
    }
  }

  return participantesCriados;
}

async removerVisitante(sala_id: string, pessoa_id: string, dono_id: string) {
  // Verificar se quem está chamando é o dono
  const sala = await salaRepository.obterPorId(sala_id, false, dono_id);
  if (!sala || sala.criado_por !== dono_id) {
    throw new Error("Apenas o dono da sala pode remover visitantes.");
  }

  // Verificar se há sessão ativa
  const sessaoAtiva = await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
  if (!sessaoAtiva) {
    throw new Error("Não há sessão ativa.");
  }

  // Verificar se é realmente visitante (não pode remover permanente)
  const participanteSala = await participanteSalaRepository.obterPorSalaEPessoa(sala_id, pessoa_id);
  if (participanteSala) {
    throw new Error("Não é possível remover participante permanente. Use a rota de remoção de participantes.");
  }

  // Remover ParticipanteSessao
  return await participanteSessaoRepository.deletar(sessaoAtiva.id, pessoa_id);
}
```

### 6. Exclusão de Sala com Validações

```typescript
// Em sala.service.ts
async excluirSala(sala_id: string, pessoa_id: string) {
  // Verificar se é o dono
  const sala = await salaRepository.obterPorId(sala_id, false, pessoa_id);
  if (!sala || sala.criado_por !== pessoa_id) {
    throw new Error("Apenas o dono pode excluir a sala.");
  }

  // VALIDAÇÃO #1: Verificar se há sessões criadas
  const totalSessoes = await sessaoSalaRepository.contarPorSala(sala_id);
  if (totalSessoes > 0) {
    throw new Error(
      "Não é possível excluir sala com sessões criadas. Exclua as sessões primeiro."
    );
  }

  // VALIDAÇÃO #2: Verificar se há votos registrados
  const totalVotos = await votoRepository.contarPorSala(sala_id);
  if (totalVotos > 0) {
    throw new Error(
      "Não é possível excluir sala com votos registrados. Histórico deve ser preservado."
    );
  }

  // Exclusão LÓGICA (soft delete)
  return await salaRepository.atualizarStatus(sala_id, true); // inativo = true
}
```

```typescript
// Em sala.repository.ts - Adicionar se não existir
async atualizarStatus(sala_id: string, inativo: boolean) {
  return await this.prismaService.sala.update({
    where: { id: sala_id },
    data: { inativo }
  });
}
```

```typescript
// Em sessao-sala.repository.ts - Adicionar se não existir
async contarPorSala(sala_id: string): Promise<number> {
  return await this.prismaService.sessaoSala.count({
    where: { sala_id }
  });
}
```

```typescript
// Em voto.repository.ts - Adicionar se não existir
async contarPorSala(sala_id: string): Promise<number> {
  return await this.prismaService.voto.count({
    where: {
      historia: {
        sala_id
      }
    }
  });
}
```

### 7. Kick de Participante (Moderação)

```typescript
// Em sessao-sala.controller.ts
async kickarParticipante(req: Request, res: Response) {
  try {
    const { sessaoId, pessoaId } = req.params;
    const usuarioLogado = req.user;
    const sala = req.sala; // Vem do salaAuthGuard

    // PROTEÇÃO: Verificar se não está tentando kickar o dono
    const sessao = await sessaoSalaRepository.obterPorId(sessaoId);
    if (!sessao) {
      return res.status(404).json(respostaErro({ mensagem: "Sessão não encontrada" }));
    }

    const salaCompleta = await salaRepository.obterPorId(sessao.sala_id, false, undefined);

    // PROTEÇÃO: Admin não pode kickar dono
    if (salaCompleta.criado_por === pessoaId && sala.Role === 1) {
      return res.status(403).json(
        respostaErro({ mensagem: "Administrador não pode remover o dono da sessão" })
      );
    }

    // PROTEÇÃO: Ninguém pode kickar a si mesmo (deve usar "sair")
    if (pessoaId === usuarioLogado?.Usu_Id) {
      return res.status(400).json(
        respostaErro({ mensagem: "Use a rota 'sair da sessão' para sair voluntariamente" })
      );
    }

    await sessaoSalaService.kickarParticipante(sessaoId, pessoaId);

    res.json(
      respostaSucesso({
        mensagem: "Participante removido da sessão com sucesso."
      })
    );
  } catch (error: any) {
    res.status(500).json(respostaErro({ mensagem: error.message }));
  }
}
```

```typescript
// Em sessao-sala.service.ts
async kickarParticipante(sessao_id: string, pessoa_id: string) {
  // Verificar se ParticipanteSessao existe
  const participante = await participanteSessaoRepository.obterPorSessaoEPessoa(
    sessao_id,
    pessoa_id
  );

  if (!participante) {
    throw new Error("Participante não encontrado nesta sessão.");
  }

  // UPDATE autorizado = false (kick)
  await participanteSessaoRepository.atualizar(sessao_id, pessoa_id, {
    autorizado: false
  });

  // TODO: Quando implementar Socket.IO, emitir evento:
  // socketService.emitToRoom(sessao_id, 'participante_kickado', { pessoa_id });

  return { sucesso: true };
}
```

```typescript
// Em participante-sessao.repository.ts - Adicionar se não existir
async atualizar(
  sessao_id: string,
  pessoa_id: string,
  dados: { autorizado?: boolean; online?: boolean }
) {
  return await this.prismaService.participanteSessao.update({
    where: {
      sessao_id_pessoa_id: {
        sessao_id,
        pessoa_id
      }
    },
    data: dados
  });
}
```

### 8. Novas rotas (CORRIGIDAS)

```typescript
// Adicionar em sala.routes.ts
router.post(
  "/:id/participantes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  participanteSalaController.adicionarParticipante
);

router.delete(
  "/:id/participantes/:pessoaId",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  participanteSalaController.removerParticipante
);

// Adicionar visitantes temporários à sessão ativa
router.post(
  "/:id/sessoes/visitantes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.adicionarVisitantes
);

// Remover visitante temporário da sessão ativa
router.delete(
  "/:id/sessoes/visitantes/:pessoaId",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.removerVisitante
);

// Kickar participante da sessão (moderação)
router.patch(
  "/:id/sessoes/:sessaoId/participantes/:pessoaId/kick",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]), // Dono e Admin
  sessaoSalaController.kickarParticipante
);

// Excluir sala (soft delete)
router.delete(
  "/:id",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  salaController.excluirSala
);
```

### 7. Atualizar controller de entrarSala (CORRIGIDO)

```typescript
// Em sala.controller.ts
async entrarSala(req: Request, res: Response) {
  try {
    const pessoa = req.user;
    const { codigo, senha, visitantes } = req.body; // visitantes é opcional

    const { tokenSala, dataExpiracao, role } = await salaService.entrarSala(
      codigo,
      pessoa?.Usu_Id as string,
      pessoa?.Ss_Id as string,
      senha,
      visitantes // Array opcional de IDs para visitantes (apenas dono pode passar)
    );

    res.json(
      respostaSucesso({
        resultado: {
          tokenSala,
          dataExpiracao,
          role
        },
        mensagem: "Login na sala realizado com sucesso.",
      })
    );
  } catch (error: any) {
    res.status(500).json(respostaErro({ mensagem: error.message }));
  }
}
```

---

## ✅ Resumo de Ações

### Arquivos a CRIAR:

1. `src/helpers/determinar-tipo-acesso.ts`
2. `src/middlewares/salaPermissaoGuard.ts`
3. `src/controllers/participantes/participante-sala.controller.ts` (se não existir)

### Arquivos a MODIFICAR:

1. `src/services/salas/sala.service.ts` - Reescrever `entrarSala`
2. `src/services/sessoes/sessao-sala.service.ts` - Adicionar `autorizarVisitante` e `removerVisitante`
3. `src/controllers/sessoes/sessao-sala.controller.ts` - Adicionar métodos
4. `src/routes/salas/sala.routes.ts` - Adicionar rotas
5. `src/routes/sessoes/sessao-sala.routes.ts` - Adicionar rotas

### Dependências a ADICIONAR no import:

- Importar `pessoaRepository` em `sala.service.ts`
- Importar helper `determinarTipoAcesso` em `sala.service.ts`

---

## 💡 Sugestões Adicionais de Funcionalidades para Admin (Role 1)

### **1. Gerenciamento de Histórias Avançado**

```typescript
// Admin pode mover histórias entre sessões
PUT /salas/:id/historias/:historiaId/mover
Body: { sessao_destino_id: string }
Permissão: [0, 1]

// Admin pode arquivar histórias antigas
POST /salas/:id/historias/:historiaId/arquivar
Permissão: [0, 1]

// Admin pode restaurar histórias arquivadas
POST /salas/:id/historias/:historiaId/restaurar
Permissão: [0, 1]
```

**Casos de Uso:**

- Reorganizar backlog entre sprints
- Limpar histórias antigas sem perder dados
- Facilitar gestão de longo prazo

---

### **2. Controle de Sessão Avançado**

```typescript
// Admin pode pausar sessão (impede novos votos)
POST /salas/:id/sessoes/:sessaoId/pausar
Permissão: [0, 1]

// Admin pode retomar sessão pausada
POST /salas/:id/sessoes/:sessaoId/retomar
Permissão: [0, 1]

// Admin pode definir tempo limite para votação
POST /salas/:id/sessoes/configurar-timer
Body: { tempo_limite_segundos: number }
Permissão: [0, 1]
```

**Casos de Uso:**

- Pausar durante breaks/interrupções
- Impor time-box nas estimativas
- Melhorar disciplina da cerimônia

---

### **3. Relatórios e Estatísticas**

```typescript
// Admin pode gerar relatório de sessão
GET /salas/:id/sessoes/:sessaoId/relatorio
Response: {
  total_historias: number,
  historias_votadas: number,
  media_pontos: number,
  consenso_percentual: number,
  participantes_ativos: number,
  tempo_medio_votacao: number
}
Permissão: [0, 1]

// Admin pode exportar histórias para CSV/JSON
GET /salas/:id/historias/exportar?formato=csv|json
Permissão: [0, 1]

// Admin pode ver histórico de mudanças
GET /salas/:id/auditoria
Permissão: [0, 1] // Dono vê tudo, admin vê últimos 30 dias
```

**Casos de Uso:**

- Retrospectivas baseadas em dados
- Documentação de decisões
- Compliance e rastreabilidade

---

### **4. Moderação e Qualidade**

```typescript
// Admin pode silenciar participante temporariamente
POST /salas/:id/participantes/:pessoaId/silenciar
Body: { duracao_minutos: number }
Permissão: [0, 1]

// Admin pode definir regras de consenso
POST /salas/:id/configurar-consenso
Body: {
  tipo: 'unanimidade' | 'maioria' | 'media',
  desvio_maximo: number
}
Permissão: [0, 1]

// Admin pode invalidar voto suspeito
DELETE /salas/:id/sessoes/:sessaoId/votos/:votoId/invalidar
Permissão: [0, 1]
```

**Casos de Uso:**

- Lidar com membros disruptivos
- Adaptar regras à cultura do time
- Garantir estimativas de qualidade

---

### **5. Comunicação e Notificações**

```typescript
// Admin pode enviar anúncio para todos
POST /salas/:id/anunciar
Body: {
  mensagem: string,
  tipo: 'info' | 'alerta' | 'urgente'
}
Permissão: [0, 1]

// Admin pode definir lembretes de sessão
POST /salas/:id/configurar-lembrete
Body: {
  minutos_antes: number,
  canais: ['email', 'push']
}
Permissão: [0, 1]
```

**Casos de Uso:**

- Comunicar mudanças importantes
- Lembrar sobre sessões agendadas
- Melhorar engajamento

---

### **6. Templates e Automação**

```typescript
// Admin pode salvar conjunto de histórias como template
POST /salas/:id/historias/salvar-template
Body: {
  nome: string,
  historia_ids: string[]
}
Permissão: [0, 1]

// Admin pode aplicar template em nova sessão
POST /salas/:id/sessoes/:sessaoId/aplicar-template
Body: { template_id: string }
Permissão: [0, 1]

// Admin pode configurar auto-avançar história
POST /salas/:id/configurar-auto-avancar
Body: {
  habilitado: boolean,
  condicao: 'todos_votaram' | 'maioria_votou' | 'tempo_esgotado'
}
Permissão: [0, 1]
```

**Casos de Uso:**

- Reaproveitar estrutura entre sprints
- Reduzir trabalho repetitivo
- Automatizar fluxo de votação

---

### **7. Integrações (Futuro)**

```typescript
// Admin pode conectar com Jira/Azure DevOps
POST /salas/:id/integracoes/jira/conectar
Body: {
  url: string,
  api_token: string,
  projeto_id: string
}
Permissão: [0, 1]

// Admin pode importar histórias de ferramenta externa
POST /salas/:id/historias/importar-jira
Body: { epic_id: string }
Permissão: [0, 1]

// Admin pode sincronizar estimativas de volta
POST /salas/:id/sessoes/:sessaoId/sincronizar-jira
Permissão: [0, 1]
```

**Casos de Uso:**

- Reduzir entrada dupla de dados
- Integrar com pipeline existente
- Manter tudo sincronizado

---

## 🔥 Implementação Futura: Socket.IO para Tempo Real

### **Eventos que devem ser emitidos em tempo real:**

```typescript
// src/services/socket/socket.service.ts

class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Emitir para todos na sala (sessao_id = room)
  emitToRoom(sessao_id: string, evento: string, dados: any) {
    this.io.to(sessao_id).emit(evento, dados);
  }

  // Emitir para usuário específico
  emitToUser(pessoa_id: string, evento: string, dados: any) {
    this.io.to(pessoa_id).emit(evento, dados);
  }
}

// Eventos para implementar:

// 1. Kick de participante
socketService.emitToUser(pessoa_id, 'participante_kickado', {
  sessao_id,
  sala_id,
  motivo: 'Removido pelo administrador',
  timestamp: new Date()
});

// 2. Sessão encerrada
socketService.emitToRoom(sessao_id, 'sessao_encerrada', {
  encerrado_por: pessoa_id,
  timestamp: new Date()
});

// 3. Participante adicionado
socketService.emitToRoom(sessao_id, 'participante_entrou', {
  pessoa: { id, nome, role },
  timestamp: new Date()
});

// 4. Participante saiu
socketService.emitToRoom(sessao_id, 'participante_saiu', {
  pessoa_id,
  timestamp: new Date()
});

// 5. Votos revelados
socketService.emitToRoom(sessao_id, 'votos_revelados', {
  historia_id,
  votos: [...],
  timestamp: new Date()
});

// 6. História selecionada
socketService.emitToRoom(sessao_id, 'historia_selecionada', {
  historia_id,
  selecionado_por: pessoa_id,
  timestamp: new Date()
});
```

### **Frontend: Listeners dos Eventos**

```typescript
// hooks/useSocketSala.ts
import { useEffect } from "react";
import { useSocket } from "@/providers/socket-provider";
import { useDispatch } from "react-redux";
import { clearSalaToken } from "@/store/slices/salaAuthSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useSocketSala(sessaoId: string | null) {
  const socket = useSocket();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!socket || !sessaoId) return;

    // Entrar na room da sessão
    socket.emit("entrar_sala", { sessao_id: sessaoId });

    // Listener: Kickado da sessão
    socket.on("participante_kickado", (data) => {
      dispatch(clearSalaToken());
      toast.error("Você foi removido da sessão pelo administrador");
      router.push("/salas");
    });

    // Listener: Sessão encerrada
    socket.on("sessao_encerrada", (data) => {
      dispatch(clearSalaToken());
      toast.info("A sessão foi encerrada");
      router.push("/salas");
    });

    // Listener: Participante entrou
    socket.on("participante_entrou", (data) => {
      toast.success(`${data.pessoa.nome} entrou na sessão`);
      // Atualizar lista de participantes no Redux
    });

    // Listener: Participante saiu
    socket.on("participante_saiu", (data) => {
      toast.info(`Um participante saiu da sessão`);
      // Atualizar lista de participantes no Redux
    });

    // Listener: Votos revelados
    socket.on("votos_revelados", (data) => {
      toast.success("Votos foram revelados!");
      // Atualizar estado de votação no Redux
    });

    // Listener: História selecionada
    socket.on("historia_selecionada", (data) => {
      toast.info("Nova história selecionada para votação");
      // Atualizar história atual no Redux
    });

    return () => {
      socket.off("participante_kickado");
      socket.off("sessao_encerrada");
      socket.off("participante_entrou");
      socket.off("participante_saiu");
      socket.off("votos_revelados");
      socket.off("historia_selecionada");
      socket.emit("sair_sala", { sessao_id: sessaoId });
    };
  }, [socket, sessaoId]);
}
```

### **Backend: Integrar nos Services**

```typescript
// Exemplo em sessao-sala.service.ts
import { socketService } from '../socket/socket.service';

async kickarParticipante(sessao_id: string, pessoa_id: string) {
  // ... validações existentes ...

  await participanteSessaoRepository.atualizar(sessao_id, pessoa_id, {
    autorizado: false
  });

  // EMITIR EVENTO SOCKET.IO
  socketService.emitToUser(pessoa_id, 'participante_kickado', {
    sessao_id,
    motivo: 'Removido pelo administrador',
    timestamp: new Date()
  });

  return { sucesso: true };
}

async encerrarSessao(sessao_id: string, pessoa_id: string) {
  // ... validações existentes ...

  await sessaoSalaRepository.atualizar(sessao_id, { ativa: false });

  // EMITIR EVENTO SOCKET.IO
  socketService.emitToRoom(sessao_id, 'sessao_encerrada', {
    encerrado_por: pessoa_id,
    timestamp: new Date()
  });

  return { sucesso: true };
}
```

### **Benefícios do Socket.IO:**

- 🚀 **Experiência instantânea**: Usuários veem ações em tempo real
- 🔒 **Segurança**: Frontend é forçado a limpar token imediatamente após kick
- 👥 **Colaboração**: Todos veem quando alguém entra/sai/vota
- 🎮 **Engajamento**: Interface reativa melhora participação
- ⚡ **Performance**: Elimina necessidade de polling constante

---

## 🎯 Recomendação de Priorização

**Implementar AGORA (MVP do Admin):**

1. ✅ 4 níveis de acesso (0, 1, 2, 3)
2. ✅ Admin pode criar/encerrar sessões
3. ✅ Admin pode gerenciar participantes e visitantes
4. ✅ Admin pode gerenciar histórias
5. ✅ Admin pode controlar votação (revelar/ocultar/selecionar)
6. ✅ Admin pode kickar participantes
7. ✅ Validação de autorizado no salaAuthGuard
8. ✅ Exclusão de sala com validações

**Implementar em SPRINT 2:**

- Relatórios básicos
- Exportar para CSV
- Pausar/retomar sessão
- Configurar regras de consenso

**Implementar DEPOIS (Nice to Have):**

- Templates de histórias
- Auto-avançar
- Integrações externas
- Lembretes e notificações avançadas
- Auditoria detalhada

---

## 📋 Checklist de Implementação

- [ ] Adicionar campo `role` em `ParticipanteSala` (migration)
- [ ] Atualizar `determinarTipoAcesso` para 4 níveis
- [ ] Atualizar `salaPermissaoGuard` para aceitar [0, 1, 2, 3]
- [ ] Atualizar todas as rotas com permissões corretas
- [ ] Reescrever `entrarSala` para tipos 0 e 1 criarem sessão
- [ ] Atualizar `criarSessao` para validar role 0 ou 1
- [ ] Adicionar rota de promover Membro a Admin (apenas dono)
- [ ] Adicionar rota de rebaixar Admin a Membro (apenas dono)
- [ ] Atualizar frontend para mostrar badges de role
- [ ] Atualizar testes unitários
- [ ] Documentar mudanças de permissão no README

---

Deseja que eu implemente todas essas alterações agora?
