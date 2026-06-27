import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bubu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubu.html',
  styleUrl: './bubu.css',
})
export class BubuPage implements OnInit, OnDestroy {
  private readonly birthdayDate = new Date('2026-07-09T00:00:00');
  private timer?: ReturnType<typeof setInterval>;

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  isBirthday = computed(
    () =>
      this.days() === 0 &&
      this.hours() === 0 &&
      this.minutes() === 0 &&
      this.seconds() === 0,
  );

  readonly stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${((i * 37 + 7) % 94) + 3}%`,
    top: `${((i * 53 + 11) % 88) + 4}%`,
    delay: `${((i * 0.41) % 3).toFixed(2)}s`,
    scale: +(0.5 + (i % 5) * 0.12).toFixed(2),
  }));

  readonly floatingHearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${((i * 73 + 15) % 80) + 10}%`,
    top: `${((i * 61 + 20) % 75) + 8}%`,
    delay: `${((i * 0.55) % 4).toFixed(2)}s`,
    emoji: ['💕', '💖', '🌸', '✨', '⭐', '🌟'][i % 6],
  }));

  // Delays de 4s entre si → ~3 visíveis ao mesmo tempo (visible window = 60% do cycle).
  // Durations bem diferentes (18-25s, sem múltiplos comuns) → após cada rodada as
  // fases derivam e elas aparecem em ordens diferentes, parecendo aleatório.
  readonly loveBubbles = [
    { id: 0, text: 'TE AMO 💖',            left: '8%',  delay: '0s',  dur: '18s' },
    { id: 1, text: 'MINHA BUBU 🐻',        left: '65%', delay: '4s',  dur: '25s' },
    { id: 2, text: 'MEU AMOR 💝',          left: '30%', delay: '8s',  dur: '20s' },
    { id: 3, text: 'MINHA PRINCESINHA 👸', left: '80%', delay: '12s', dur: '23s' },
    { id: 4, text: 'MINHA PELUCINHA 🧸',   left: '18%', delay: '16s', dur: '19s' },
    { id: 5, text: 'MINHA SONEQUINHA 😴',  left: '52%', delay: '20s', dur: '22s' },
  ];

  readonly confetti = Array.from({ length: 64 }, (_, i) => ({
    id: i,
    left: `${(i * 1.5625).toFixed(1)}%`,
    delay: `${((i * 0.07) % 4).toFixed(2)}s`,
    duration: `${(2.5 + (i % 6) * 0.4).toFixed(1)}s`,
    color: [
      '#FF6B6B', '#FFD93D', '#6BCB77', '#4ECDC4',
      '#C77DFF', '#FF9A9E', '#FFB6C1', '#FFEAA7',
      '#A8E6CF', '#FF8B94',
    ][i % 10],
    size: `${10 + (i % 5) * 3}px`,
    isCircle: i % 3 !== 0,
    rotation: (i * 47) % 360,
  }));

  ngOnInit(): void {
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private tick(): void {
    const diff = this.birthdayDate.getTime() - Date.now();
    if (diff <= 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      clearInterval(this.timer!);
      return;
    }
    this.days.set(Math.floor(diff / 86_400_000));
    this.hours.set(Math.floor((diff % 86_400_000) / 3_600_000));
    this.minutes.set(Math.floor((diff % 3_600_000) / 60_000));
    this.seconds.set(Math.floor((diff % 60_000) / 1_000));
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
