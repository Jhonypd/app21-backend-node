export function obterVotosVencedoresHistoria(
  votos: Record<number, number>,
): number[] {
  const entries = Object.entries(votos);

  if (entries.length === 0) return [];

  let maiorContagem = 0;
  let vencedores: number[] = [];

  for (const [valor, contagem] of entries) {
    const voto = Number(valor);

    if (contagem > maiorContagem) {
      maiorContagem = contagem;
      vencedores = [voto];
    } else if (contagem === maiorContagem) {
      vencedores.push(voto);
    }
  }

  return vencedores.sort((a, b) => b - a);
}
