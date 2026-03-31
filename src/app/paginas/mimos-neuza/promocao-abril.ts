import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promocao-abril',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="promo-page">

      <!-- Fundo com pétalas decorativas -->
      <div class="petala petala-1">🌸</div>
      <div class="petala petala-2">🌸</div>
      <div class="petala petala-3">🌸</div>
      <div class="petala petala-4">🌸</div>

      <!-- Texto cursivo de fundo (marca d'água) -->
      <div class="marca-dagua-top">Mães</div>
      <div class="marca-dagua-bottom">mães</div>

      <!-- Balões decorativos -->
      <div class="balao balao-tl">❤️</div>
      <div class="balao balao-tr">❤️</div>
      <div class="balao balao-br">❤️</div>
      <div class="balao balao-ml">❤️</div>

      <!-- Conteúdo principal -->
      <div class="conteudo">

        <!-- Título cursivo -->
        <div class="titulo-cursivo">Mães</div>

        <!-- Grid: texto + polaroid -->
        <div class="grid-principal">

          <!-- Coluna esquerda: texto da promoção -->
          <div class="coluna-texto">
            <div class="caixa-texto">
              <p class="linha-destaque">Promoção Especial de Abril</p>
              <p class="linha-normal">Comprou, participou!</p>
              <p class="linha-normal">
                Durante todo o mês de abril até o Dia das Mães, cada cliente que adquirir seus mimos,
                estará concorrendo a um
              </p>
              <p class="linha-destaque">presente especial</p>
            </div>

            <!-- Balão pequeno à esquerda -->
            <div class="balao-inline">❤️</div>

            <div class="caixa-cta">
              <p>Garanta já o seu<br>e boa sorte! 🍀</p>
            </div>

            <!-- Data -->
            <div class="data-linha">
              <span class="icone-calendario">📅</span>
              <span>12 de Maio</span>
            </div>

            <!-- Redes sociais -->
            <div class="redes-sociais">
              <span>📱</span>
              <span>📸</span>
              <span>📘</span>
              <span>▶️</span>
              <span>🐦</span>
            </div>
          </div>

          <!-- Coluna direita: moldura polaroid -->
          <div class="coluna-polaroid">
            <div class="polaroid">
              <div class="polaroid-imagem">
                <div class="placeholder-imagem">
                  <span>📷</span>
                  <p>Sua foto aqui</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Nunito:wght@400;600;700;800&display=swap');

    .promo-page {
      position: relative;
      width: 100%;
      min-height: 100vh;
      background: linear-gradient(135deg, #fff5f7 0%, #ffe8ef 40%, #ffd6e4 100%);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Nunito', sans-serif;
    }

    /* Pétalas decorativas */
    .petala {
      position: absolute;
      font-size: 1.5rem;
      opacity: 0.35;
      animation: float 4s ease-in-out infinite;
    }
    .petala-1 { top: 8%; left: 3%; animation-delay: 0s; }
    .petala-2 { top: 15%; right: 5%; animation-delay: 1s; }
    .petala-3 { bottom: 20%; left: 8%; animation-delay: 2s; }
    .petala-4 { bottom: 10%; right: 10%; animation-delay: 1.5s; }

    /* Marca d'água cursiva */
    .marca-dagua-top, .marca-dagua-bottom {
      position: absolute;
      font-family: 'Great Vibes', cursive;
      font-size: clamp(5rem, 15vw, 12rem);
      color: #f472b6;
      opacity: 0.08;
      user-select: none;
      pointer-events: none;
      white-space: nowrap;
    }
    .marca-dagua-top { top: -2%; left: -2%; transform: rotate(-8deg); }
    .marca-dagua-bottom { bottom: -3%; right: -2%; transform: rotate(-5deg); }

    /* Balões de coração */
    .balao {
      position: absolute;
      font-size: 2.5rem;
      animation: float 3s ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(236, 72, 153, 0.4));
    }
    .balao-tl { top: 5%; left: 12%; animation-delay: 0.5s; font-size: 3rem; }
    .balao-tr { top: 3%; right: 8%; animation-delay: 1.2s; font-size: 4rem; }
    .balao-br { bottom: 5%; right: 5%; animation-delay: 0.8s; font-size: 3.5rem; }
    .balao-ml { top: 55%; left: 5%; animation-delay: 1.8s; font-size: 2rem; }

    /* Conteúdo central */
    .conteudo {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 680px;
      padding: 2rem 1.5rem;
    }

    /* Título cursivo principal */
    .titulo-cursivo {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(3.5rem, 12vw, 6rem);
      color: #ec4899;
      text-align: center;
      margin-bottom: -1rem;
      filter: drop-shadow(2px 3px 4px rgba(236, 72, 153, 0.3));
      animation: fadeDown 0.8s ease-out;
    }

    /* Grid principal */
    .grid-principal {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: center;
    }

    /* Coluna de texto */
    .coluna-texto {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      animation: fadeLeft 0.9s ease-out;
    }

    .caixa-texto {
      background: #ec4899;
      border-radius: 8px;
      padding: 1rem 1.1rem;
      color: white;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .linha-destaque {
      font-weight: 800;
      font-size: 0.95rem;
      margin: 2px 0;
    }

    .linha-normal {
      font-weight: 400;
      margin: 2px 0;
    }

    .balao-inline {
      font-size: 2rem;
      text-align: left;
      margin-left: 0.5rem;
      filter: drop-shadow(0 3px 6px rgba(236, 72, 153, 0.5));
    }

    .caixa-cta {
      background: #ec4899;
      border-radius: 8px;
      padding: 0.7rem 1rem;
      color: white;
      font-size: 0.9rem;
      font-weight: 700;
      line-height: 1.4;
    }

    .data-linha {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #9d174d;
      font-size: 0.85rem;
      font-weight: 700;
      margin-top: 0.3rem;
    }

    .redes-sociais {
      display: flex;
      gap: 0.6rem;
      font-size: 1.1rem;
    }

    /* Polaroid */
    .coluna-polaroid {
      display: flex;
      justify-content: center;
      animation: fadeRight 0.9s ease-out;
    }

    .polaroid {
      background: white;
      padding: 0.8rem 0.8rem 2.5rem 0.8rem;
      border-radius: 4px;
      box-shadow:
        0 10px 30px rgba(236, 72, 153, 0.25),
        0 4px 10px rgba(0, 0, 0, 0.1);
      transform: rotate(5deg);
      transition: transform 0.3s ease;
      max-width: 260px;
    }

    .polaroid:hover {
      transform: rotate(2deg) scale(1.03);
    }

    .polaroid-imagem {
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(135deg, #fce7f3, #fbcfe8);
      border-radius: 2px;
      overflow: hidden;
    }

    .placeholder-imagem {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ec4899;
      opacity: 0.5;
      gap: 0.5rem;
      font-size: 0.8rem;
    }

    .placeholder-imagem span {
      font-size: 2.5rem;
    }

    /* Animações */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fadeRight {
      from { opacity: 0; transform: translateX(20px) rotate(5deg); }
      to { opacity: 1; transform: translateX(0) rotate(5deg); }
    }

    /* Responsivo */
    @media (max-width: 520px) {
      .grid-principal {
        grid-template-columns: 1fr;
      }
      .coluna-polaroid {
        order: -1;
      }
      .polaroid {
        transform: rotate(3deg);
        max-width: 200px;
      }
    }
  `]
})
export class PromocaoAbrilComponent {}