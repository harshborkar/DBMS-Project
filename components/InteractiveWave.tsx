import React, { useEffect, useRef } from 'react';

const InteractiveWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let time = 0;

    // Configuration for wave layers
    const waves = [
      {
        baseY: height * 0.6,
        length: 0.003,
        amplitude: 60,
        speed: 0.005,
        color: 'rgba(225, 246, 232, 0.6)', // leaf-100
        offset: 0
      },
      {
        baseY: height * 0.65,
        length: 0.005,
        amplitude: 50,
        speed: 0.007,
        color: 'rgba(196, 235, 212, 0.5)', // leaf-200
        offset: 2
      },
      {
        baseY: height * 0.7,
        length: 0.006,
        amplitude: 40,
        speed: 0.009,
        color: 'rgba(150, 217, 182, 0.3)', // leaf-300
        offset: 4
      }
    ];

    let mouse = { x: width / 2, y: height / 2 };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background fill
      ctx.fillStyle = '#fafaf9'; // earth-50
      ctx.fillRect(0, 0, width, height);

      time += 1;

      // Performance optimization: Increase step size on smaller screens or lower power devices
      const step = width < 768 ? 10 : 5; 

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Start drawing from left
        ctx.lineTo(0, wave.baseY);

        for (let x = 0; x <= width; x += step) { 
          // Mouse interaction: vertical position affects phase/height slightly
          const mouseFactorY = (mouse.y / height) * 2;
          
          // Calculate wave y position
          const sine1 = Math.sin(x * wave.length + time * wave.speed + wave.offset);
          const sine2 = Math.sin(x * wave.length * 0.5 + time * wave.speed * 0.5); 
          
          const y = wave.baseY + 
                   (sine1 * wave.amplitude) + 
                   (sine2 * wave.amplitude * 0.5) +
                   (mouseFactorY * 20); 

          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Recalculate base Y positions relative to new height
      waves[0].baseY = height * 0.6;
      waves[1].baseY = height * 0.65;
      waves[2].baseY = height * 0.7;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on devices with fine pointers
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
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none"
    />
  );
};

export default InteractiveWave;