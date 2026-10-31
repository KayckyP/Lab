/**
 * Algoritmo de empacotamento em prateleiras (Shelf First-Fit Decreasing Height)
 * para a visualização explodida (Exploded View).
 * Organiza todas as malhas visíveis em um inventário bidimensional no plano XY,
 * eliminando qualquer sobreposição e ajustando a largura conforme o aspect ratio do visor.
 */
export function createExplosionLayout(parts, aspect = 1) {
  // Constrói as caixas de projeção no plano XY com margem de segurança de 4 cm
  const cards = parts.map(p => ({
    id: p.id,
    system: p.system,
    width: Math.max(0.035, p.bounds[1][0] - p.bounds[0][0]) + 0.04,
    height: Math.max(0.035, p.bounds[1][1] - p.bounds[0][1]) + 0.04
  }));

  const totalArea = cards.reduce((sum, c) => sum + c.width * c.height, 0);
  const maxWidth = Math.max(0.3, ...cards.map(c => c.width));
  const clampedAspect = Math.max(0.5, Math.min(1.5, aspect));
  const targetWidth = Math.max(maxWidth, Math.sqrt(totalArea * clampedAspect) * 1.18);

  // Ordenação decrescente por altura (otimização de prateleiras)
  cards.sort((a, b) => b.height - a.height || a.id.localeCompare(b.id));

  const cells = new Map();
  let x = 0;
  let y = 0;
  let rowHeight = 0;
  let usedWidth = 0;

  for (const card of cards) {
    if (x > 0 && x + card.width > targetWidth) {
      x = 0;
      y += rowHeight;
      rowHeight = 0;
    }
    cells.set(card.id, {
      x: x + card.width / 2,
      y: -y - card.height / 2,
      width: card.width,
      height: card.height
    });
    x += card.width;
    usedWidth = Math.max(usedWidth, x);
    rowHeight = Math.max(rowHeight, card.height);
  }

  const totalHeight = y + rowHeight;

  // Centraliza o grid em (0, 0)
  cells.forEach(cell => {
    cell.x -= usedWidth / 2;
    cell.y += totalHeight / 2;
  });

  return {
    cells,
    width: usedWidth,
    height: totalHeight
  };
}
