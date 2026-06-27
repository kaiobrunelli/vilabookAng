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

  readonly loveBubbles = [
    { id: 0,  text: 'TE AMO 💖',             left: '8%',  delay: '0s',   dur: '7s'  },
    { id: 1,  text: 'MINHA PRINCESINHA 👸',  left: '24%', delay: '2.1s', dur: '8.5s'},
    { id: 2,  text: 'MEU AMOR 💝',           left: '42%', delay: '4.2s', dur: '6.5s'},
    { id: 3,  text: 'MINHA BUBU 🐻',         left: '60%', delay: '1.3s', dur: '7.5s'},
    { id: 4,  text: 'MINHA PELUCINHA 🧸',    left: '76%', delay: '3.5s', dur: '6s'  },
    { id: 5,  text: 'MINHA SONEQUINHA 😴',   left: '88%', delay: '5.8s', dur: '8s'  },
    { id: 6,  text: 'TE AMO 💖',             left: '52%', delay: '6.5s', dur: '7s'  },
    { id: 7,  text: 'MEU AMOR 💝',           left: '16%', delay: '8s',   dur: '6.5s'},
    { id: 8,  text: 'MINHA BUBU 🐻',         left: '70%', delay: '0.7s', dur: '7.5s'},
    { id: 9,  text: 'MINHA PRINCESINHA 👸',  left: '36%', delay: '9s',   dur: '9s'  },
    { id: 10, text: 'MINHA PELUCINHA 🧸',    left: '82%', delay: '4s',   dur: '6s'  },
    { id: 11, text: 'MINHA SONEQUINHA 😴',   left: '4%',  delay: '7s',   dur: '8s'  },
    { id: 12, text: 'TE AMO 💖',             left: '93%', delay: '3s',   dur: '7s'  },
    { id: 13, text: 'MEU AMOR 💝',           left: '47%', delay: '10s',  dur: '6.5s'},
    { id: 14, text: 'MINHA BUBU 🐻',         left: '30%', delay: '5s',   dur: '7.5s'},
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
