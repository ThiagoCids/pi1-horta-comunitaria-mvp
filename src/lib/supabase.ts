/**
 * ============================================================
 * ARQUIVO: supabase.ts (Configuração do Banco de Dados)
 * ============================================================
 *
 * O QUE ESTE ARQUIVO FAZ:
 * Este é o ponto de conexão entre o nosso aplicativo e o Supabase,
 * que é o nosso Banco de Dados na nuvem (similar ao Firebase).
 * Aqui criamos um "cliente" — um objeto que nos permite fazer
 * operações de leitura e escrita no banco de qualquer lugar do app.
 *
 * COMO SE CONECTA COM O RESTO DO SISTEMA:
 * Todos os hooks (useCanteiros, useEstoque, etc.) importam o
 * objeto `supabase` deste arquivo para acessar o banco de dados.
 * Este é o ÚNICO arquivo que fala diretamente com o Supabase.
 * ============================================================
 */

// Importamos a função 'createClient' da biblioteca oficial do Supabase
import { createClient } from '@supabase/supabase-js'

// Lemos a URL do projeto Supabase a partir das variáveis de ambiente (.env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'

// Lemos a chave pública (anon key) — ela permite acesso ao banco com permissões limitadas
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Criamos e exportamos o cliente Supabase para ser usado em todo o projeto
export const supabase = createClient(supabaseUrl, supabaseKey)
