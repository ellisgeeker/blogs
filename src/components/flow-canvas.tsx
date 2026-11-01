'use client';
import { useLayoutEffect, useRef } from 'react';

type Particle = { x: number; y: number; r: number; phase: number; speed: number; amber: boolean };
type Thread = {
  y: number;
  offset: number;
  phase: number;
  alpha: number;
  amber: boolean;
  thickness: number;
  flow: number;
};

function cubic(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  u: number,
) {
  const mt = 1 - u,
    mt2 = mt * mt,
    mt3 = mt2 * mt,
    u2 = u * u,
    u3 = u2 * u;
  return {
    x: mt3 * ax + 3 * mt2 * u * bx + 3 * mt * u2 * cx + u3 * dx,
    y: mt3 * ay + 3 * mt2 * u * by + 3 * mt * u2 * cy + u3 * dy,
  };
}

// Kept at module level so a remount (e.g. switching locale) resumes the same pointer offset.
const pointer = { x: 0, y: 0 };

// Procedural visual artwork: deterministic composition, no external textures, video, or GPU dependency.
export function FlowCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Layout effect: the first frame is drawn before paint, so a remount never shows a blank canvas.
  useLayoutEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext('2d', { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0,
      width = 0,
      height = 0;
    let visible = true;
    const rand = (() => {
      let s = 10813;
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    })();
    const particles: Particle[] = Array.from({ length: 180 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 2.1,
      phase: rand() * Math.PI * 2,
      speed: 0.55 + rand(),
      amber: rand() > 0.54,
    }));
    const threads: Thread[] = Array.from({ length: 92 }, (_, i) => ({
      y: i / 91,
      offset: (rand() - 0.5) * 0.5,
      phase: rand() * Math.PI * 2,
      alpha: 0.08 + rand() * 0.28,
      amber: rand() > 0.44,
      thickness: 0.4 + rand() * 0.9,
      flow: 0.55 + rand(),
    }));
    const resize = () => {
      const rect = element.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const onPointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      pointer.y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Time comes from the page clock, not a frame counter: it survives remounts and
      // runs at the same speed on 60Hz and 120Hz displays.
      const t = reduced.matches ? 0 : performance.now() * 0.00042;
      const mx = pointer.x,
        my = pointer.y;
      const size = width;
      const centerX = size * 0.55 + mx * 12,
        centerY = height * 0.46 + my * 8;
      const haze = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, width * 0.48);
      haze.addColorStop(0, 'rgba(221,141,67,.14)');
      haze.addColorStop(0.32, 'rgba(21,95,103,.10)');
      haze.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';
      threads.forEach((line, i) => {
        const band = line.y - 0.5;
        const sy = height * (0.06 + line.y * 0.72);
        const delta = line.offset * height;
        const pulse = Math.sin(t * (0.28 + (i % 5) * 0.04) + line.phase) * 8;
        const x0 = -width * 0.12;
        const x1 = width * 1.16;
        const joinY = centerY + band * height * 0.13 + delta * 0.13;
        const c1x = width * 0.25,
          c1y = sy + delta + band * height * 0.5 + pulse;
        const c2x = width * 0.38,
          c2y = joinY + band * height * 0.26;
        const c3x = width * 0.72,
          c3y = joinY - band * height * 0.58;
        const c4x = width * 0.82,
          c4y = sy * 0.48 + delta * 0.8 + pulse;
        const y1 = sy + delta,
          y2 = sy * 0.34 + delta;
        const rgb = line.amber ? '235,166,91' : '100,191,202';
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, `rgba(${rgb},0)`);
        grad.addColorStop(0.27, `rgba(${rgb},${line.alpha * 0.53})`);
        grad.addColorStop(0.57, `rgba(${rgb},${line.alpha * 1.55})`);
        grad.addColorStop(0.91, `rgba(${rgb},${line.alpha * 0.34})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.moveTo(x0, y1);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, centerX, joinY);
        ctx.bezierCurveTo(c3x, c3y, c4x, c4y, x1, y2);
        ctx.lineWidth = line.thickness;
        ctx.strokeStyle = grad;
        ctx.setLineDash([]);
        ctx.stroke();
        if (!reduced.matches) {
          ctx.setLineDash([36 + (i % 5) * 8, 52 + (i % 7) * 10]);
          ctx.lineDashOffset = -(t * (22 + line.flow * 16) + line.phase * 18);
          ctx.strokeStyle = `rgba(${rgb},${line.alpha * 1.15})`;
          ctx.lineWidth = line.thickness * 1.05;
          ctx.stroke();
          ctx.setLineDash([]);
          const packets = 1 + (i % 2);
          for (let k = 0; k < packets; k++) {
            const u = (((t * 0.035 * line.flow + line.phase * 0.16 + k / packets) % 1) + 1) % 1;
            const p =
              u < 0.5
                ? cubic(x0, y1, c1x, c1y, c2x, c2y, centerX, joinY, u * 2)
                : cubic(centerX, joinY, c3x, c3y, c4x, c4y, x1, y2, u * 2 - 1);
            const nearCore = 1 - Math.min(1, Math.abs(u - 0.5) * 2.4);
            const glowR = 3.5 + nearCore * 5;
            const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
            glow.addColorStop(0, `rgba(255,232,196,${0.32 + nearCore * 0.22})`);
            glow.addColorStop(0.4, `rgba(${rgb},${0.22 + nearCore * 0.18})`);
            glow.addColorStop(1, `rgba(${rgb},0)`);
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      const bloom = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.12);
      bloom.addColorStop(0, 'rgba(255,202,126,.33)');
      bloom.addColorStop(0.17, 'rgba(243,170,93,.13)');
      bloom.addColorStop(1, 'rgba(243,170,93,0)');
      ctx.fillStyle = bloom;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.12, 0, Math.PI * 2);
      ctx.fill();
      particles.forEach((p) => {
        const drift = reduced.matches ? 0 : (((p.x + t * p.speed * 0.016) % 1) + 1) % 1;
        const x =
          drift * width +
          Math.sin(t * 0.45 + p.phase) * (reduced.matches ? 0 : 7) +
          mx * 8 * p.speed;
        const y =
          p.y * height +
          Math.cos(t * 0.38 + p.phase) * (reduced.matches ? 0 : 6) +
          my * 6 * p.speed;
        const twinkle = reduced.matches
          ? 0.55
          : 0.45 + 0.35 * Math.sin(t * p.speed * 1.4 + p.phase);
        const color = p.amber ? `rgba(244,170,95,${twinkle})` : `rgba(137,210,215,${twinkle})`;
        if (p.r > 1.35) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, p.r * 8);
          glow.addColorStop(0, color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(x - p.r * 8, y - p.r * 8, p.r * 16, p.r * 16);
        }
        ctx.beginPath();
        ctx.arc(x, y, p.r * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    };
    const tick = () => {
      if (visible && !reduced.matches) draw();
      raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) draw();
    });
    observer.observe(element);
    element.addEventListener('pointermove', onPointer);
    const ro = new ResizeObserver(resize);
    ro.observe(element);
    const onReduce = () => draw();
    reduced.addEventListener('change', onReduce);
    resize();
    tick();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      element.removeEventListener('pointermove', onPointer);
      reduced.removeEventListener('change', onReduce);
    };
  }, []);
  return (
    <canvas
      ref={canvas}
      className="flow-canvas"
      role="img"
      aria-label="Abstract flowing cyan and amber light filaments over a dark space"
    />
  );
}
