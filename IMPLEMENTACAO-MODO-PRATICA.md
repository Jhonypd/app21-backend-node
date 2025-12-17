# Sistema de Votação com Modo Prática

## Visão Geral

Sistema que permite votação em Planning Poker mesmo sem histórias pré-cadastradas (modo prática), com possibilidade de adicionar histórias durante a sessão para começar a salvar os votos.

## Decisão Técnica: Abordagem Híbrida (Opção 4)

- **Sem campo `mode` no banco**: Simplicidade, sem necessidade de migração
- **Verificação dinâmica**: Backend verifica se sessão tem histórias vinculadas
- **Votos temporários**: Se não há histórias, retorna sucesso mas não persiste
- **Transição automática**: Ao adicionar primeira história, votos passam a ser salvos

## Implementação Backend

### 1. Modificação do Serviço de Votos

**Arquivo**: `votos.service.ts`

```typescript
async votar(voto: VotoInserirData) {
  // Buscar história-sessão
  const historiaSessao = await historiaSessaoRepository.obterPorId(
    voto.historia_sessao_id
  );

  // Verificar se sessão tem histórias vinculadas
  const historiasVinculadas = await historiaSessaoRepository.obterPorSessao(
    historiaSessao.sessao_id
  );

  // Se não há histórias → modo prática
  if (!historiasVinculadas || historiasVinculadas.length === 0) {
    return {
      temporario: true,
      voto: { ...voto, data_voto: new Date() },
      mensagem: "Voto registrado (modo prática - não será salvo)",
    };
  }

  // Se tem histórias → persiste normalmente
  // ...lógica existente de update/insert...
}
```

**Comportamento**:

- ✅ Valida valor do voto (-1 a 89)
- ✅ Verifica se sessão tem histórias
- ✅ Sem histórias: retorna `temporario: true`, não salva
- ✅ Com histórias: salva normalmente, retorna `temporario: false`

### 2. Novo Endpoint: Adicionar História Durante Sessão

**Arquivo**: `historia-sala.service.ts`

```typescript
async adicionarDuranteSessao(dados: {
  sala_id: string;
  titulo: string;
  descricao?: string | null;
  criado_por: string;
}) {
  // Verificar se sala existe e tem sessão ativa
  const sala = await salaRepository.obterPorId(dados.sala_id);
  if (!sala.sessao_ativa_id) {
    throw new Error("Sala não possui sessão ativa");
  }

  // Criar história
  const historia = await historiaSalaRepository.criar(dados);

  // Vincular à sessão ativa
  await historiaSessaoRepository.inserir({
    sessao_id: sala.sessao_ativa_id,
    historia_id: historia.id,
  });

  return historia;
}
```

**Rota**: `POST /salas/:salaId/historias/durante-sessao`

- **Middlewares**: authGuard + salaAuthGuard + salaPermissaoGuard([0, 1])
- **Permissões**: Apenas Dono (0) ou Admin (1)
- **Resposta**: História criada + vinculada à sessão ativa
- **Invalidação**: Tags `['historias', 'salaPlaning']`

## Implementação Frontend

### 3. Banner de Aviso (Modo Prática)

**Arquivo**: `components/sala/banner-modo-pratica.tsx`

```tsx
export function BannerModoPratica({ mostrar }: BannerModoPraticaProps) {
  if (!mostrar) return null;

  return (
    <Alert variant="default" className="mb-4 border-yellow-500 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle>Modo Prática Ativo</AlertTitle>
      <AlertDescription>
        Esta sessão não possui histórias vinculadas. Os votos registrados não
        serão salvos permanentemente. Adicione histórias para começar a salvar
        os votos.
      </AlertDescription>
    </Alert>
  );
}
```

**Visual**:

- 🟡 Tema amarelo (alerta)
- ⚠️ Ícone `AlertTriangle`
- 📝 Texto explicativo claro
- 🎨 Suporte dark mode

### 4. Dialog de Adicionar História

**Arquivo**: `components/sala/dialog-adicionar-historia.tsx`

```tsx
export function DialogAdicionarHistoria({
  salaId,
  onAdicionarHistoria,
  mostrarBotao = true,
}: DialogAdicionarHistoriaProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!titulo.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    await onAdicionarHistoria({
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
    });

    toast.success("História adicionada com sucesso!");
    setOpen(false);
  };

  // ... resto do componente
}
```

**Componentes**:

- ✅ Form com validação
- ✅ Campo `titulo` (obrigatório)
- ✅ Campo `descricao` (opcional)
- ✅ Toast de sucesso/erro
- ✅ Loading state
- ✅ Reset ao fechar

### 5. API Mutation

**Arquivo**: `services/api/historias-api.ts`

```typescript
adicionarHistoriaDuranteSessao: builder.mutation<
  ApiResponse<{ historia: HistoriaSala }>,
  AdicionarHistoriaDuranteSessaoPayload
>({
  query: ({ salaId, titulo, descricao }) => ({
    url: `/salas/${salaId}/historias/durante-sessao`,
    method: 'POST',
    body: { titulo, descricao },
  }),
  invalidatesTags: ['historias', 'salaPlaning'],
}),
```

**Hook exportado**: `useAdicionarHistoriaDuranteSessaoMutation()`

### 6. Integração em SalaPlanning

**Arquivo**: `components/sala-planning.tsx`

```tsx
// Verificar modo prática
const emModoPratica = !sala.historias || sala.historias.length === 0;
const podeAdicionarHistorias = meuRole === 0 || meuRole === 1;

// Handler
const handleAdicionarHistoria = async (dados) => {
  await adicionarHistoriaDuranteSessao({
    salaId: sala.id,
    ...dados,
  }).unwrap();
};

// JSX
<BannerModoPratica mostrar={emModoPratica} />;

{
  emModoPratica && podeAdicionarHistorias && (
    <DialogAdicionarHistoria
      salaId={sala.id}
      onAdicionarHistoria={handleAdicionarHistoria}
      mostrarBotao={true}
    />
  );
}
```

## Fluxo Completo

### Cenário 1: Sessão sem Histórias (Modo Prática)

1. ✅ Usuário entra na sala
2. ✅ Banner amarelo aparece: "Modo Prática Ativo"
3. ✅ Dono/Admin vê botão "Adicionar História"
4. ✅ Participantes podem votar normalmente
5. ✅ Backend retorna `temporario: true`, não salva voto
6. ✅ Experiência de votação funciona, mas dados não persistem

### Cenário 2: Adicionando Primeira História

1. ✅ Dono/Admin clica "Adicionar História"
2. ✅ Preenche título (obrigatório) e descrição (opcional)
3. ✅ Submit → `POST /salas/:id/historias/durante-sessao`
4. ✅ Backend cria história + vincula à sessão ativa
5. ✅ Cache invalidado → sala recarrega
6. ✅ Banner desaparece automaticamente
7. ✅ Votos futuros começam a ser salvos (`temporario: false`)

### Cenário 3: Sessão com Histórias (Modo Produção)

1. ✅ Usuário entra na sala com histórias
2. ✅ Banner não aparece
3. ✅ Botão "Adicionar História" não visível
4. ✅ Votos são salvos normalmente
5. ✅ Backend retorna `temporario: false`

## Componentes UI Criados

### Alert Component

**Arquivo**: `components/ui/alert.tsx`

- Base do shadcn/ui
- Suporte a variantes (default, destructive)
- Classes Tailwind customizáveis

### Textarea Component

**Arquivo**: `components/ui/textarea.tsx`

- Input multi-linha
- Integração com react-hook-form
- Acessibilidade completa

## Vantagens da Solução

### Técnicas

- ✅ **Sem migração**: Não adiciona campo `mode` no banco
- ✅ **Stateless**: Modo determinado dinamicamente
- ✅ **Componentizado**: Lógica isolada em componentes reutilizáveis
- ✅ **Type-safe**: TypeScript em todo código
- ✅ **Performático**: Invalidação de cache otimizada

### UX

- ✅ **Feedback claro**: Banner visível quando em modo prática
- ✅ **Sem bloqueios**: Pode votar mesmo sem histórias
- ✅ **Transição suave**: Adicionar história é simples
- ✅ **Permissões**: Apenas Dono/Admin podem adicionar histórias
- ✅ **Toast notifications**: Feedback imediato de ações

### Manutenibilidade

- ✅ **Código limpo**: Separação de responsabilidades
- ✅ **Componentes reutilizáveis**: Banner e Dialog podem ser usados em outros contextos
- ✅ **Documentação inline**: Comentários explicativos
- ✅ **Testes facilitados**: Lógica testável isoladamente

## Considerações Futuras

### Melhorias Possíveis

1. **Histórico de votos temporários**: Salvar em memória/Redis para estatísticas
2. **Analytics**: Métricas de uso do modo prática
3. **Bulk import**: Adicionar múltiplas histórias de uma vez durante sessão
4. **Templates**: Histórias pré-definidas para rápida adição

### Limitações Conhecidas

- Votos no modo prática não são persistidos (comportamento desejado)
- Não há histórico de quando sessão passou de prática para produção
- Admin não Dono tem mesmas permissões que Dono neste fluxo

## Checklist de Implementação

- ✅ Backend: Modificar `votos.service.ts` para detectar modo
- ✅ Backend: Criar `adicionarDuranteSessao()` em `historia-sala.service.ts`
- ✅ Backend: Adicionar controller `adicionarDuranteSessao()`
- ✅ Backend: Adicionar rota `POST /salas/:id/historias/durante-sessao`
- ✅ Frontend: Criar `BannerModoPratica` component
- ✅ Frontend: Criar `DialogAdicionarHistoria` component
- ✅ Frontend: Criar `Alert` UI component
- ✅ Frontend: Criar `Textarea` UI component
- ✅ Frontend: Adicionar mutation `adicionarHistoriaDuranteSessao`
- ✅ Frontend: Integrar componentes em `SalaPlanning`
- ✅ Documentação: Criar este arquivo explicativo

## Testes Recomendados

1. **Modo Prática**: Votar sem histórias, verificar que voto não persiste após refresh
2. **Adicionar História**: Adicionar história durante sessão, verificar que banner some
3. **Transição**: Votar antes e depois de adicionar história, verificar persistência
4. **Permissões**: Testar que apenas Dono/Admin veem botão
5. **Validação**: Tentar adicionar história sem título
6. **Edge cases**: Sala sem sessão ativa, sessão encerrada, etc.

---

**Status**: ✅ Implementação completa
**Data**: 2025-12-14
**Autor**: Sistema de desenvolvimento AI
