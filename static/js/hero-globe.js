function initHeroGlobe(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width, height;

  function getCssVar(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function hexToRgb(hex) {
    let parsed = hex.replace('#', '');
    if (parsed.length === 3) {
      parsed = parsed.split('').map((c) => c + c).join('');
    }
    const bigint = parseInt(parsed, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function rgba(rgb, alpha) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  const accentRgb = hexToRgb(getCssVar('--color-accent', '#00BFFF'));
  const primaryAltRgb = hexToRgb(getCssVar('--color-primary-alt', '#008CFF'));

  const globeNodes = [];
  const arcs = [];
  const numNodes = 350;
  const globeRadius = 220;

  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < numNodes; i++) {
    const y = 1 - (i / (numNodes - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const isHighlight = Math.random() > 0.92;
    const depthOffset = 1 + (Math.random() * 0.06 - 0.03);

    globeNodes.push({
      x: x * depthOffset, y: y * depthOffset, z: z * depthOffset,
      baseRadius: isHighlight ? 2 : 1,
      color: isHighlight ? rgba(accentRgb, 1) : rgba(primaryAltRgb, 0.8)
    });
  }

  for (let i = 0; i < 10; i++) {
    arcs.push({
      n1: Math.floor(Math.random() * numNodes),
      n2: Math.floor(Math.random() * numNodes),
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.005
    });
  }

  const orbitalRings = [
    { radius: 1.3, tiltX: 0.2, tiltZ: 0.5, speed: 0.001, angle: 0 },
    { radius: 1.45, tiltX: -0.4, tiltZ: 0.2, speed: -0.0015, angle: Math.PI / 3 },
    { radius: 1.2, tiltX: 0.5, tiltZ: -0.3, speed: 0.002, angle: Math.PI / 1.5 }
  ];

  function resizeCanvas() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let angleY = 0;
  const angleX = 0.2;

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    angleY += 0.002;

    const cx = width / 2, cy = height / 2, fov = 800;

    const gradient = ctx.createRadialGradient(cx, cy, globeRadius * 0.4, cx, cy, globeRadius * 1.6);
    gradient.addColorStop(0, rgba(accentRgb, 0.15));
    gradient.addColorStop(0.5, rgba(accentRgb, 0.04));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const sinY = Math.sin(angleY), cosY = Math.cos(angleY);
    const sinX = Math.sin(angleX), cosX = Math.cos(angleX);

    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(primaryAltRgb, 0.1);
    ctx.setLineDash([2, 4]);

    for (let lat = -4; lat <= 4; lat++) {
      const y = lat * 0.22;
      const r = Math.sqrt(1 - y * y) * globeRadius;
      ctx.beginPath();
      for (let lon = 0; lon <= Math.PI * 2.01; lon += 0.1) {
        const x = Math.cos(lon) * r, z = Math.sin(lon) * r;
        const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
        const y1 = (y * globeRadius) * cosX - z1 * sinX;
        const z2 = (y * globeRadius) * sinX + z1 * cosX;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale, py = cy + y1 * scale;
        lon === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (let lon = 0; lon < Math.PI; lon += Math.PI / 6) {
      ctx.beginPath();
      for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 0.01; lat += 0.1) {
        const y = Math.sin(lat) * globeRadius, r = Math.cos(lat) * globeRadius;
        const x = Math.cos(lon) * r, z = Math.sin(lon) * r;
        const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX, z2 = y * sinX + z1 * cosX;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale, py = cy + y1 * scale;
        lat === -Math.PI / 2 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const projectedNodes = [];
    for (let i = 0; i < numNodes; i++) {
      const n = globeNodes[i];
      const x1 = n.x * cosY - n.z * sinY, z1 = n.x * sinY + n.z * cosY;
      const y1 = n.y * cosX - z1 * sinX, z2 = n.y * sinX + z1 * cosX;
      const scale = fov / (fov + z2 * globeRadius);
      const px = cx + x1 * globeRadius * scale, py = cy + y1 * globeRadius * scale;
      projectedNodes.push({ px, py, z: z2, scale, color: n.color, r: n.baseRadius });
    }

    orbitalRings.forEach(ring => {
      ring.angle += ring.speed;
      ctx.beginPath();
      ctx.strokeStyle = rgba(accentRgb, 0.2);
      ctx.lineWidth = 1;
      for (let i = 0; i <= Math.PI * 2.01; i += 0.05) {
        const x = Math.cos(i) * globeRadius * ring.radius, z = Math.sin(i) * globeRadius * ring.radius;
        const ty = x * ring.tiltX + z * ring.tiltZ;
        const x1 = x * Math.cos(ring.angle) - z * Math.sin(ring.angle);
        const z1 = x * Math.sin(ring.angle) + z * Math.cos(ring.angle);
        const px_rot = x1 * cosY - z1 * sinY, pz_rot = x1 * sinY + z1 * cosY;
        const py_rot = ty * cosX - pz_rot * sinX, final_z = ty * sinX + pz_rot * cosX;
        const scale = fov / (fov + final_z);
        const px = cx + px_rot * scale, py = cy + py_rot * scale;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      const dot_x = globeRadius * ring.radius, dot_z = 0;
      const dot_ty = dot_x * ring.tiltX + dot_z * ring.tiltZ;
      const dx1 = dot_x * Math.cos(ring.angle) - dot_z * Math.sin(ring.angle);
      const dz1 = dot_x * Math.sin(ring.angle) + dot_z * Math.cos(ring.angle);
      const px_rot_d = dx1 * cosY - dz1 * sinY, pz_rot_d = dx1 * sinY + dz1 * cosY;
      const py_rot_d = dot_ty * cosX - pz_rot_d * sinX, final_z_d = dot_ty * sinX + pz_rot_d * cosX;

      if (final_z_d > -globeRadius * 1.5) {
        const scale = fov / (fov + final_z_d);
        const pX = cx + px_rot_d * scale, pY = cy + py_rot_d * scale;
        ctx.beginPath(); ctx.arc(pX, pY, 2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = rgba(accentRgb, 1); ctx.fill();
        ctx.beginPath(); ctx.arc(pX, pY, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = rgba(accentRgb, 0.4); ctx.fill();
      }
    });

    ctx.lineWidth = 1.5;
    arcs.forEach((arc) => {
      arc.progress += arc.speed;
      if (arc.progress > 1) arc.progress = 0;
      const pn1 = projectedNodes[arc.n1], pn2 = projectedNodes[arc.n2];
      if (pn1.z > -0.5 && pn2.z > -0.5) {
        ctx.beginPath();
        ctx.moveTo(pn1.px, pn1.py);
        const mx = (pn1.px + pn2.px) / 2, my = (pn1.py + pn2.py) / 2 - 20 * pn1.scale;
        ctx.quadraticCurveTo(mx, my, pn2.px, pn2.py);
        const grad = ctx.createLinearGradient(pn1.px, pn1.py, pn2.px, pn2.py);
        grad.addColorStop(0, rgba(accentRgb, 0));
        grad.addColorStop(arc.progress, rgba(accentRgb, 0.8));
        grad.addColorStop(Math.min(1, arc.progress + 0.1), rgba(accentRgb, 0));
        ctx.strokeStyle = grad;
        ctx.stroke();
      }
    });

    projectedNodes.sort((a, b) => b.z - a.z);
    for (let i = 0; i < projectedNodes.length; i++) {
      const p = projectedNodes[i];
      const alpha = Math.min(1, Math.max(0.1, p.z + 1.2));
      const distFromCenter = Math.sqrt((p.px - cx) ** 2 + (p.py - cy) ** 2);
      const edgeFactor = Math.min(1, distFromCenter / (globeRadius * 0.8));
      const finalAlpha = Math.min(1, alpha * (0.5 + edgeFactor * 0.5));

      ctx.beginPath();
      ctx.arc(p.px, p.py, p.r * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = finalAlpha;
      ctx.fill();

      if (p.r > 1.5 && finalAlpha > 0.4) {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r * 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = rgba(accentRgb, 0.3);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    drawFrame();
    if (!prefersReducedMotion) {
      requestAnimationFrame(loop);
    }
  }

  loop();
}
