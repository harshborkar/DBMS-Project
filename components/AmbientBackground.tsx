import React, { useEffect, useRef } from 'react';

const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };
    const sprites: Record<string, HTMLCanvasElement> = {};

    // Soft pastel colors from the theme
    const colors = [
      { r: 225, g: 246, b: 232 }, // leaf-100
      { r: 254, g: 243, b: 199 }, // amber-100
      { r: 219, g: 234, b: 254 }, // blue-100
      { r: 196, g: 235, b: 212 }, // leaf-200
      { r: 255, g: 237, b: 213 }, // orange-100
    ];

    // Pre-render gradients to offscreen canvases (Sprite Caching)
    // This creates a texture for each color once, avoiding expensive gradient creation per frame
    const initSprites = () => {
      const size = 300; // Resolution of the sprite
      const half = size / 2;
      
      colors.forEach(c => {
        const key = `${c.r},${c.g},${c.b}`;
        if (sprites[key]) return;

        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = size;
        spriteCanvas.height = size;
        const sCtx = spriteCanvas.getContext('2d');
        
        if (sCtx) {
          const grad = sCtx.createRadialGradient(half, half, 0, half, half, half);
          grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.6)`); // Slightly reduced alpha for better blending
          grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`);
          grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
          
          sCtx.fillStyle = grad;
          sCtx.beginPath();
          sCtx.arc(half, half, half, 0, Math.PI * 2);
          sCtx.fill();
        }
        sprites[key] = spriteCanvas;
      });
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      color: { r: number, g: number, b: number };
      vx: number;
      vy: number;
      angle: number;
      angularSpeed: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Adjusted sizes for sprite rendering
        this.baseRadius = Math.random() * 150 + 100; 
        this.radius = this.baseRadius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.3; // Slower for more relaxing feel
        this.vy = (Math.random() - 0.5) * 0.3;
        
        // Breathing properties
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = Math.random() * 0.015 + 0.005;
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Pulse size
        this.angle += this.angularSpeed;
        this.radius = this.baseRadius + Math.sin(this.angle) * 25;

        // Seamless wrap
        if (this.x < -this.radius) this.x = w + this.radius;
        if (this.x > w + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = h + this.radius;
        if (this.y > h + this.radius) this.y = -this.radius;

        // Interactive Mouse Repulsion - Disabled on mobile for perf
        if (mouse.x > -100) {
           const dx = mouse.x - this.x;
           const dy = mouse.y - this.y;
           const distance = Math.sqrt(dx * dx + dy * dy);
           const interactionRadius = 400;

           if (distance < interactionRadius) {
             const force = (interactionRadius - distance) / interactionRadius;
             const angle = Math.atan2(dy, dx);
             this.x -= Math.cos(angle) * force * 1.5;
             this.y -= Math.sin(angle) * force * 1.5;
           }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const key = `${this.color.r},${this.color.g},${this.color.b}`;
        const sprite = sprites[key];
        
        if (sprite) {
          // Draw image is much faster than createRadialGradient
          ctx.drawImage(
            sprite, 
            this.x - this.radius, 
            this.y - this.radius, 
            this.radius * 2, 
            this.radius * 2
          );
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSprites();
      
      particles = [];
      // Reduce particle count on mobile for performance
      const divisor = window.innerWidth < 768 ? 400 : 250;
      const numberOfParticles = Math.max(4, Math.floor(window.innerWidth / divisor));
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      // Solid background base (fast clear)
      ctx.fillStyle = '#fafaf9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Performance: check if pointer is fine (mouse)
      if (window.matchMedia('(pointer: fine)').matches) {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none -z-20"
    />
  );
};

export default AmbientBackground;