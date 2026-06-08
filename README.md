# Casamento Joao Pedro e Jessica

Convite digital premium em Next.js, React, TypeScript, TailwindCSS e Framer Motion.

## Rodar localmente

```bash
npm install
npm run dev
```

## Configurar dados reais

Atualize `lib/wedding-data.ts`:

- Chave Pix do Joao
- E-mail para receber confirmacoes de presenca (`rsvpEmail`)
- Nome/cidade do recebedor Pix
- Fotos reais dos noivos
- Dados finais de padrinhos, historia e presentes

## Supabase

O projeto ja possui adaptador inicial em `lib/supabase.ts` e schema em `supabase-schema.sql`.

Variaveis para `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Sem essas credenciais, RSVP/admin/presentes usam persistencia local no navegador para demonstracao.

## Admin

Rota: `/admin`

Senha demo: `casamento2026`

Em producao, substitua por autenticacao real do Supabase Auth.
