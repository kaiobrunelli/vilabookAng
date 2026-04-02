# VilaBook

Plataforma de anúncios e reservas de imóveis para temporada, construída do zero com Angular e Supabase.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)

---

## Sobre o projeto

O VilaBook é uma plataforma web voltada para o mercado de aluguéis de temporada. Proprietários podem cadastrar imóveis com fotos, descrições e valores, enquanto interessados podem visualizar os detalhes e entrar em contato diretamente via WhatsApp. O projeto foi desenvolvido com foco em boas práticas de arquitetura frontend e integração direta com um backend serverless.

---

## Stack de tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Angular 21 |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Backend / BaaS | Supabase |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth + Google OAuth |
| Storage | Supabase Storage |
| Deploy | Vercel |

---

## Principais funcionalidades

- Cadastro e autenticação de usuários com Google OAuth
- Listagem de imóveis com filtros e galeria de fotos com lightbox
- Cadastro de imóveis com upload e compressão de imagens
- Edição inline de propriedades pelo proprietário
- Contato direto com o proprietário via WhatsApp
- Máscara de input para preço e suporte a diária ou mensal
- Controle de acesso por RLS policies no Supabase
- Componentes standalone sem NgModule

---

## Padrões de arquitetura

- Componentes standalone (sem NgModule) com lazy loading via `loadComponent`
- Arquivos separados por extensão: `.ts`, `.html`, `.css`
- Atualização imutável de arrays com spread syntax
- Detecção de mudanças explícita com `ChangeDetectorRef.detectChanges()`
- Getter pattern no `SupabaseService` para acesso ao client
- RLS policies para controle de acesso por usuário

---

## Como rodar localmente
```bash
git clone https://github.com/seu-usuario/vilabook.git
cd vilabook
npm install
ng serve
```

Configure as variáveis de ambiente em `environment.ts`:
```typescript
export const environment = {
  supabaseUrl: 'SUA_URL',
  supabaseKey: 'SUA_CHAVE_ANON'
};
```
