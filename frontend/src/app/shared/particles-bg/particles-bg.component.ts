import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-particles-bg',
    standalone: true,
    template: `<canvas #canvas class="fixed inset-0 w-full h-full bg-black -z-10"></canvas>`,
    styles: [`
    canvas {
      display: block;
      pointer-events: none;
    }
  `]
})
export class ParticlesBgComponent implements OnInit, OnDestroy {
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private platformId = inject(PLATFORM_ID);
    private ngZone = inject(NgZone);
    private animationId?: number;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                this.initStarfield();
            });
        }
    }

    private initStarfield() {
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: Star[] = [];
        const starCount = 400;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Star {
            x!: number;
            y!: number;
            size!: number;
            speedX!: number;
            speedY!: number;
            opacity!: number;
            color!: string;
            isHero!: boolean;
            blinkSpeed!: number;
            blinkValue!: number;

            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Initially fill screen
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 10;
                this.size = Math.random() * 1.5 + 0.2;
                this.speedX = Math.random() * 0.1 - 0.05;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.opacity = Math.random() * 0.5 + 0.5;
                this.isHero = Math.random() > 0.97; // 3% chance to be a large glowing star
                this.blinkSpeed = Math.random() * 0.05 + 0.01;
                this.blinkValue = Math.random() * Math.PI;

                const colors = [
                    '#ffffff', // White
                    '#60a5fa', // Blue
                    '#a78bfa', // Purple
                    '#f472b6', // Pink
                    '#fb923c', // Orange
                    '#4ade80'  // Green (rare)
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];

                if (this.isHero) {
                    this.size = Math.random() * 2 + 2;
                    this.color = '#ffffff'; // Hero stars are usually white/bright blue
                }
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.blinkValue += this.blinkSpeed;

                if (this.y < -100) {
                    this.reset();
                }
            }

            draw() {
                if (!ctx) return;
                const currentOpacity = this.opacity * (0.6 + Math.sin(this.blinkValue) * 0.4);

                ctx.save();
                ctx.globalAlpha = currentOpacity;
                ctx.fillStyle = this.color;

                if (this.isHero) {
                    // Draw Hero Star Glow (Cross shape)
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = this.color;

                    // Center circle
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Horizontal Beam
                    const beamWidth = this.size * 8;
                    const beamHeight = 1;
                    ctx.fillRect(this.x - beamWidth / 2, this.y - beamHeight / 2, beamWidth, beamHeight);

                    // Vertical Beam
                    ctx.fillRect(this.x - beamHeight / 2, this.y - beamWidth / 2, beamHeight, beamWidth);
                } else {
                    // Normal star
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }

        const animate = () => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(s => {
                s.update();
                s.draw();
            });

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    ngOnDestroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
