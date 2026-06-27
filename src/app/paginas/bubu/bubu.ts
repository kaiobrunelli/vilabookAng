import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActiveBubble {
  id: number;
  text: string;
  left: string;
}

@Component({
  selector: 'app-bubu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubu.html',
  styleUrl: './bubu.css',
})
export class BubuPage implements OnInit, OnDestroy {
  private readonly birthdayDate = new Date('2026-07-09T00:00:00');
  private countdownTimer?: ReturnType<typeof setInterval>;
  private spawnTimer?: ReturnType<typeof setTimeout>;
  private bubbleId = 0;
  private audio?: HTMLAudioElement;

  musicPlaying = signal(false);

  days    = signal(0);
  hours   = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  activeBubbles = signal<ActiveBubble[]>([]);

  isBirthday = computed(
    () =>
      this.days() === 0 &&
      this.hours() === 0 &&
      this.minutes() === 0 &&
      this.seconds() === 0,
  );

  private readonly phrases = [
    'TE AMO 💖',
    'MINHA PRINCESINHA 👸',
    'MEU AMOR 💝',
    'MINHA BUBU 🐻',
    'MINHA PELUCINHA 🧸',
    'MINHA SONEQUINHA 😴',
  ];

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
    this.countdownTimer = setInterval(() => this.tick(), 1000);
    this.scheduleNextBubble();
    this.setupAudio();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownTimer);
    clearTimeout(this.spawnTimer);
    this.audio?.pause();
  }

  private setupAudio(): void {
    this.audio = new Audio('/music.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.35;
    this.audio.play()
      .then(() => this.musicPlaying.set(true))
      .catch(() => {
        // Autoplay bloqueado pelo navegador — usuário clica no botão para iniciar
        this.musicPlaying.set(false);
      });
  }

  toggleMusic(): void {
    if (!this.audio) return;
    if (this.musicPlaying()) {
      this.audio.pause();
      this.musicPlaying.set(false);
    } else {
      this.audio.play().then(() => this.musicPlaying.set(true));
    }
  }

  private scheduleNextBubble(): void {
    this.spawnTimer = setTimeout(() => {
      if (!this.isBirthday() && this.activeBubbles().length < 3) {
        this.spawnBubble();
      }
      this.scheduleNextBubble();
    }, 2000);
  }

  private spawnBubble(): void {
    const LIFESPAN = 7500;
    const id   = this.bubbleId++;
    const text = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    const left = `${6 + Math.random() * 80}%`;

    this.activeBubbles.update(list => [...list, { id, text, left }]);

    setTimeout(() => {
      this.activeBubbles.update(list => list.filter(b => b.id !== id));
    }, LIFESPAN);
  }

  private tick(): void {
    const diff = this.birthdayDate.getTime() - Date.now();
    if (diff <= 0) {
      this.days.set(0); this.hours.set(0);
      this.minutes.set(0); this.seconds.set(0);
      clearInterval(this.countdownTimer!);
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
