import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mimos-neuza',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
         style="background: linear-gradient(135deg, #FDF7F8 0%, #FFD1DC 40%, #F48FB1 100%);">

      <!-- Decorative blobs -->
      <div class="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-30 pointer-events-none"
           style="background: radial-gradient(circle, #E91E63, #F48FB1); filter: blur(40px);"></div>
      <div class="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-20 pointer-events-none"
           style="background: radial-gradient(circle, #FFD1DC, #E91E63); filter: blur(50px);"></div>
      <div class="absolute top-1/2 left-[-40px] w-40 h-40 rounded-full opacity-20 pointer-events-none"
           style="background: #F48FB1; filter: blur(30px);"></div>

      <!-- Floating hearts -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        @for (h of hearts; track h.id) {
          <span class="absolute text-2xl animate-bounce opacity-30"
                [style.left]="h.left"
                [style.top]="h.top"
                [style.animation-delay]="h.delay"
                [style.font-size]="h.size">
            🎀
          </span>
        }
      </div>

      <!-- Header -->
      <div class="relative z-10 text-center mb-8 px-4">
        <p class="text-sm tracking-[0.3em] uppercase mb-2" style="color: #9C1B4A; font-family: 'Georgia', serif;">
          ✨ surpresas especiais ✨
        </p>
        <h1 class="text-5xl md:text-7xl font-bold leading-tight drop-shadow-md"
            style="font-family: 'Georgia', serif; color: #6B0F35; letter-spacing: -1px;">
          Mimos da
        </h1>
        <h1 class="text-5xl md:text-7xl font-bold leading-tight drop-shadow-md"
            style="font-family: 'Georgia', serif; color: #E91E63; letter-spacing: -1px;">
          Neuza
        </h1>
        <div class="mt-3 flex justify-center gap-2">
          <span class="w-2 h-2 rounded-full inline-block" style="background:#E91E63;"></span>
          <span class="w-8 h-2 rounded-full inline-block" style="background:#F48FB1;"></span>
          <span class="w-2 h-2 rounded-full inline-block" style="background:#E91E63;"></span>
        </div>
      </div>

      <!-- Roulette Wheel -->
      <div class="relative z-10 flex flex-col items-center">

        <!-- Wheel Container -->
        <div class="relative mb-8">
          <!-- Pointer arrow -->
          <div class="absolute top-[-18px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div class="w-0 h-0"
                 style="border-left: 14px solid transparent;
                        border-right: 14px solid transparent;
                        border-top: 28px solid #6B0F35;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></div>
          </div>

          <!-- Wheel -->
          <div class="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl"
               style="transition: transform {{ isSpinning() ? '5s' : '0s' }} cubic-bezier(0.17, 0.67, 0.12, 0.99);
                      transform: rotate({{ currentAngle() }}deg);
                      border: 6px solid #6B0F35;
                      box-shadow: 0 0 0 3px #F48FB1, 0 20px 60px rgba(107,15,53,0.4);"
               [style.transform]="'rotate(' + currentAngle() + 'deg)'"
               [style.transition]="isSpinning() ? 'transform 5s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none'">

            <svg viewBox="0 0 200 200" class="w-full h-full">
              @for (gift of gifts; track gift.id; let i = $index) {
                <path [attr.d]="getSlicePath(i)"
        [attr.fill]="getSliceColor(i)"
        stroke="#6B0F35"
        stroke-width="0.8"/>

  <!-- APENAS ESSE TEXT, sem o do emoji -->
  <text [attr.transform]="getTextTransform(i, 80)"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="7"
        font-weight="bold"
        font-family="Georgia, serif"
        fill="#6B0F35">
    {{ gift.name }}
  </text>
              }

              <!-- Center circle -->
              <circle cx="100" cy="100" r="18" fill="#6B0F35"/>
              <circle cx="100" cy="100" r="14" fill="#E91E63"/>
              <circle cx="100" cy="100" r="10" fill="#FFD1DC"/>
              <text x="100" y="100" text-anchor="middle" dominant-baseline="middle"
                    font-size="10">🎀</text>
            </svg>
          </div>
        </div>

        <!-- Result display -->
        @if (result()) {
          <div class="mb-6 text-center animate-bounce px-6 py-4 rounded-2xl shadow-xl"
               style="background: rgba(255,255,255,0.85); border: 2px solid #E91E63; backdrop-filter: blur(8px);">
            <p class="text-xs tracking-widest uppercase mb-1" style="color: #9C1B4A; font-family: Georgia, serif;">
              Seu mimo é
            </p>
            <p class="text-2xl font-bold" style="color: #E91E63; font-family: Georgia, serif;">
              {{ result()!.emoji }} {{ result()!.name }}
            </p>
          </div>
        }

        <!-- Spin Button -->
        <button
          (click)="spin()"
          [disabled]="isSpinning()"
          class="relative px-10 py-4 rounded-full text-white text-lg font-bold tracking-widest uppercase shadow-xl
                 transition-all duration-300 active:scale-95 overflow-hidden"
          style="font-family: Georgia, serif;
                 background: {{ isSpinning() ? 'linear-gradient(135deg,#c4758a,#9C1B4A)' : 'linear-gradient(135deg,#E91E63,#6B0F35)' }};
                 border: 2px solid rgba(255,255,255,0.3);
                 box-shadow: 0 8px 30px rgba(233,30,99,0.5);"
          [style.background]="isSpinning()
            ? 'linear-gradient(135deg,#c4758a,#9C1B4A)'
            : 'linear-gradient(135deg,#E91E63,#6B0F35)'">

          <span class="relative z-10">
            {{ isSpinning() ? '✨ Girando...' : '🎁 Girar a Roleta!' }}
          </span>

          @if (!isSpinning()) {
            <div class="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                 style="background: rgba(255,255,255,0.15);"></div>
          }
        </button>

        <p class="mt-4 text-xs tracking-widest opacity-60" style="color: #6B0F35; font-family: Georgia, serif;">
          ☁ Toque para descobrir seu mimo
        </p>
      </div>
    </div>
  `,
  styles: [`
    @keyframes floatUp {
      0% { transform: translateY(0px); opacity: 0.3; }
      50% { transform: translateY(-15px); opacity: 0.5; }
      100% { transform: translateY(0px); opacity: 0.3; }
    }
    .animate-bounce { animation: floatUp 3s ease-in-out infinite; }
  `]
})
export default class MimosNeuzaPage {
  // ═══════════════════════════════════════════════
  // 🎁 EDITE SEUS PRESENTES AQUI
  gifts = [
    { id: 1, name: 'Toalha Rosto', emoji: '🍫', peso: 30 },
    { id: 2, name: 'Pao de Mel', emoji: '🍫', peso: 20 },
    { id: 3, name: 'Toalha Banho', emoji: '🌸', peso: 25 },
    { id: 4, name: 'Pao de Mel', emoji: '🍫', peso: 20 },
    { id: 5, name: 'R$ 50 em produtos', emoji: '🌹', peso: 15 },
    { id: 6, name: 'Pano de Prato', emoji: '🌸', peso: 25 },
    { id: 7, name: 'Pao de Mel', emoji: '🍫', peso: 20 },

  ];
  // ═══════════════════════════════════════════════

  sliceColors = [
    '#FFD1DC', '#F48FB1', '#FFE4EC', '#FFADC5',
    '#FFC0CB', '#F8BBD0', '#FCE4EC', '#F48FB1',
  ];

  hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + i * 12}%`,
    top: `${5 + (i % 3) * 30}%`,
    delay: `${i * 0.4}s`,
    size: `${1.2 + (i % 3) * 0.4}rem`,
  }));

  currentAngle = signal(0);
  isSpinning = signal(false);
  result = signal<{ name: string; emoji: string } | null>(null);

  get sliceAngle() { return 360 / this.gifts.length; }

  getSlicePath(i: number): string {
    const a = this.sliceAngle;
    const start = (i * a - 90) * Math.PI / 180;
    const end = ((i + 1) * a - 90) * Math.PI / 180;
    const x1 = 100 + 100 * Math.cos(start);
    const y1 = 100 + 100 * Math.sin(start);
    const x2 = 100 + 100 * Math.cos(end);
    const y2 = 100 + 100 * Math.sin(end);
    return `M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`;
  }

  getTextTransform(i: number, r: number = 68): string {
    const a = this.sliceAngle;
    const mid = (i * a + a / 2 - 90) * Math.PI / 180;
    const tx = 100 + r * Math.cos(mid);
    const ty = 100 + r * Math.sin(mid);
    const rot = i * a + a / 2;
    return `translate(${tx},${ty}) rotate(${rot})`;
  }

  getTextTransform2(i: number): string {
    const a = this.sliceAngle;
    const mid = (i * a + a / 2 - 90) * Math.PI / 180;
    const r = 55;
    const tx = 100 + r * Math.cos(mid);
    const ty = 100 + r * Math.sin(mid);
    const rot = i * a + a / 2;
    return `translate(${tx},${ty}) rotate(${rot})`;
  }

  getSliceColor(i: number): string {
    return this.sliceColors[i % this.sliceColors.length];
  }

  spin(): void {
  if (this.isSpinning()) return;
  this.result.set(null);
  this.isSpinning.set(true);

  const totalPeso = this.gifts.reduce((acc, g) => acc + g.peso, 0);
  let sorteio = Math.random() * totalPeso;
  let randomIndex = 0;
  for (let i = 0; i < this.gifts.length; i++) {
    sorteio -= this.gifts[i].peso;
    if (sorteio <= 0) { randomIndex = i; break; }
  }

  const a = this.sliceAngle;
  const spins = 5 * 360;

  // Ângulo atual normalizado (0~360)
  const currentNormalized = ((this.currentAngle() % 360) + 360) % 360;

  // Centro da fatia sorteada (0~360)
  const sliceCenter = (randomIndex * a + a / 2);

  // Quanto precisa girar para o centro da fatia ficar no topo
  const needed = (360 - sliceCenter - currentNormalized + 360) % 360;

  const targetAngle = this.currentAngle() + spins + needed;
  this.currentAngle.set(targetAngle);

  setTimeout(() => {
    this.isSpinning.set(false);
    this.result.set(this.gifts[randomIndex]);
  }, 5100);
}
}