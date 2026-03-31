import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../servicos/supabase';


@Component({
  selector: 'app-mimos-neuza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mimos-neuza.html',
  styleUrl: './mimos-neuza.css'
})
export class MimosNeuzaPage {

  private supabase = inject(SupabaseService);

  // ═══════════════════════════════════════════
  // 🎁 EDITE OS PRESENTES AQUI
  gifts = [
    { id: 1, name: 'Toalha Rosto', peso: 30 },
    { id: 2, name: 'Pao de Mel', peso: 20 },
    { id: 3, name: 'Toalha Banho', peso: 25 },
    { id: 4, name: 'Pao de Mel', peso: 20 },
    { id: 5, name: 'R$ 50 produtos', peso: 15 },
    { id: 6, name: 'Pano de Prato', peso: 25 },
    { id: 7, name: 'Pao de Mel', peso: 20 },
  ];
  // ═══════════════════════════════════════════

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

  // Signals de estado
  currentAngle = signal(0);
  isSpinning = signal(false);
  result = signal<{ name: string; peso: number } | null>(null);

  // Signals do código
  codigo = signal('');
  codigoValidado = signal(false);
  validando = signal(false);
  mensagemCodigo = signal('');

  // ─── Input handler ───────────────────────────────────────
  onCodigoInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);
    this.codigo.set(val);
    this.mensagemCodigo.set('');
    this.codigoValidado.set(false);
  }

  getInputBorderColor(): string {
    if (this.codigoValidado()) return '#2e7d32';
    if (this.mensagemCodigo() && !this.codigoValidado()) return '#c62828';
    return '#F48FB1';
  }

  // ─── Validar código via Supabase ─────────────────────────
  async validarCodigo(): Promise<void> {
    if (this.validando() || this.codigo().length < 6) return;

    this.validando.set(true);
    this.mensagemCodigo.set('');

    try {
      const { data, error } = await this.supabase.client
        .from('roleta_codigos')
        .select('usado')
        .eq('codigo', this.codigo().toUpperCase().trim())
        .single();

      if (error || !data) {
        this.codigoValidado.set(false);
        this.mensagemCodigo.set('❌ Código inválido.');
        return;
      }

      if (data.usado) {
        this.codigoValidado.set(false);
        this.mensagemCodigo.set('❌ Este código já foi utilizado.');
        return;
      }

      this.codigoValidado.set(true);
      this.mensagemCodigo.set('✓ Código válido! Gire a roleta.');

    } catch {
      this.mensagemCodigo.set('❌ Erro de conexão. Tente novamente.');
    } finally {
      this.validando.set(false);
    }
  }

  // ─── Girar roleta ────────────────────────────────────────
  spin(): void {
    if (!this.codigoValidado() || this.isSpinning() || this.result()) return;

    this.result.set(null);
    this.isSpinning.set(true);

    // Sorteio com peso
    const totalPeso = this.gifts.reduce((acc, g) => acc + g.peso, 0);
    let sorteio = Math.random() * totalPeso;
    let randomIndex = 0;

    for (let i = 0; i < this.gifts.length; i++) {
      sorteio -= this.gifts[i].peso;
      if (sorteio <= 0) { randomIndex = i; break; }
    }

    // Cálculo do ângulo final
    const a = this.sliceAngle;
    const spins = 5 * 360;
    const currentNormalized = ((this.currentAngle() % 360) + 360) % 360;
    const sliceCenter = randomIndex * a + a / 2;
    const needed = (360 - sliceCenter - currentNormalized + 360) % 360;
    const targetAngle = this.currentAngle() + spins + needed;

    this.currentAngle.set(targetAngle);

    // Após parar, registra o prêmio no banco
    setTimeout(async () => {
      this.isSpinning.set(false);
      const premio = this.gifts[randomIndex];
      this.result.set(premio);
      await this.registrarPremio(premio.name);
    }, 5100);
  }

  // ─── Registrar prêmio via Supabase ───────────────────────
  private async registrarPremio(nomePremio: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('roleta_codigos')
      .update({
        usado: true,
        premio: nomePremio,
        usado_em: new Date().toISOString(),
      })
      .eq('codigo', this.codigo().toUpperCase().trim())
      .eq('usado', false);

    if (error) {
      console.error('Erro ao registrar prêmio:', error);
    }
  }

  // ─── Helpers SVG ─────────────────────────────────────────
  get sliceAngle(): number {
    return 360 / this.gifts.length;
  }

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

  getSliceColor(i: number): string {
    return this.sliceColors[i % this.sliceColors.length];
  }
}