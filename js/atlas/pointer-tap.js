/**
 * Discriminador cinemático de toques e cliques para WebGL.
 * Evita que movimentos de rotação orbital, pan ou pinça (zoom)
 * acionem indevidamente a seleção de peças anatômicas.
 */
export class PointerTap {
  constructor() {
    this.active = new Map();
    this.blocked = false;
  }

  down(id, x, y, threshold = 6) {
    if (this.active.size === 0) {
      this.blocked = false;
    }
    this.active.set(id, { x, y, threshold });
    if (this.active.size > 1) {
      // Mais de um dedo simultâneo (pinch zoom / rotação multi-touch) bloqueia clique
      this.blocked = true;
    }
  }

  move(id, x, y) {
    const start = this.active.get(id);
    if (start && Math.hypot(x - start.x, y - start.y) > start.threshold) {
      this.blocked = true;
    }
  }

  up(id, x, y) {
    this.move(id, x, y);
    const wasTap = this.active.has(id) && this.active.size === 1 && !this.blocked;
    this.active.delete(id);
    return wasTap;
  }

  cancel(id) {
    this.active.delete(id);
    this.blocked = true;
  }
}
