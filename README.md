# Casamento Joao Pedro e Jessica

Convite digital premium em Next.js, React, TypeScript, TailwindCSS e Framer Motion.

## Rodar localmente

```bash
npm install
npm run dev
```

## Configurar dados reais

Atualize `lib/wedding-data.ts`:

- E-mail para receber confirmacoes de presenca (`rsvpEmail`)
- Fotos reais dos noivos
- Dados finais de padrinhos, historia e presentes

## Pix dos presentes

Crie um arquivo `.env.local` a partir de `.env.local.example` e preencha:

```bash
NEXT_PUBLIC_PIX_KEY=chave-pix-real-do-joao-ou-jessica
NEXT_PUBLIC_PIX_KEY_TYPE=auto
NEXT_PUBLIC_PIX_MERCHANT_NAME=JOAO PEDRO E JESSICA
NEXT_PUBLIC_PIX_MERCHANT_CITY=COTIA
NEXT_PUBLIC_RSVP_EMAIL=casamento.joao.jessica.2026@gmail.com
```

Use `NEXT_PUBLIC_PIX_KEY_TYPE=phone` quando a chave Pix for celular. Para CPF, use `cpf`; para e-mail, `email`; para chave aleatoria, `random`. Isso evita que uma chave celular de 11 digitos seja interpretada como CPF.

Quando o convidado seleciona um presente, o QR Code e o Pix copia e cola sao gerados com o valor daquele produto. O pagamento cai na conta vinculada a chave Pix configurada.

Importante: QR Code Pix estatico nao confirma pagamento automaticamente no site. Para marcar como pago sozinho no banco/admin, e necessario usar uma integracao Pix com webhook via provedor como banco, Mercado Pago, Gerencianet/Efi, Pagar.me, Asaas ou outro PSP.

## Supabase

O projeto ja possui adaptador inicial em `lib/supabase.ts` e schema em `supabase-schema.sql`.

Variaveis para `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Passos:

1. Crie um projeto no Supabase.
2. Abra `SQL Editor`.
3. Cole e execute o conteudo de `supabase-schema.sql`.
4. Em `Project Settings > API`, copie:
   - `Project URL` para `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Reinicie o servidor local.

Com essas credenciais, RSVP e Pix gerados na lista de presentes passam a ser registrados no Supabase. Sem essas credenciais, RSVP/admin/presentes usam persistencia local no navegador para demonstracao.

Observacao importante: Supabase registra a intencao de pagamento e o valor do presente. Para confirmar pagamento automaticamente, e necessario integrar um provedor Pix com webhook.

## Admin

Rota: `/admin`

Senha demo: `casamento2026`

Em producao, substitua por autenticacao real do Supabase Auth.
