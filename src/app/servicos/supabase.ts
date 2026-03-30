import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }
  // Login com Google
  async loginComGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`  // ← mudou
      }
    });
    if (error) throw error;
  }

  // Logout
  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Buscar usuário logado
  async usuarioAtual() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // Observar mudanças de sessão
  onAuthChange(callback: (usuario: any) => void) {
    this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }
  // Buscar todos os imóveis
  async listarImoveis() {
    const { data, error } = await this.supabase
      .from('imoveis')
      .select('*')
      .is('deletado_em', null)
      .order('criado_em', { ascending: false });

    console.log('data:', data);
    console.log('error:', error);

    if (error) throw error;
    return data;
  }

  // Buscar imóvel por ID
  async buscarPorId(id: string) {
    const { data, error } = await this.supabase
      .from('imoveis')        // ← sem vbk.
      .select('*')
      .eq('id', id)
      .is('deletado_em', null)
      .single();

    if (error) throw error;
    return data;
  }

  // Cadastrar imóvel
  async cadastrarImovel(imovel: any) {
    const { data: { user } } = await this.supabase.auth.getUser();

    const { data, error } = await this.supabase
      .from('imoveis')
      .insert([{ ...imovel, criado_por: user?.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Upload de imagem
  async uploadImagem(arquivo: File): Promise<string> {
    const nomeArquivo = `${Date.now()}-${arquivo.name}`;

    const { error } = await this.supabase.storage
      .from('imagens-imoveis')
      .upload(nomeArquivo, arquivo);

    if (error) throw error;

    // Retorna a URL pública da imagem
    const { data } = this.supabase.storage
      .from('imagens-imoveis')
      .getPublicUrl(nomeArquivo);

    return data.publicUrl;
  }
  // Buscar imóveis do usuário logado
  async meusImoveis() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    const { data, error } = await this.supabase
      .from('imoveis')
      .select('*')
      .eq('criado_por', user.id)
      .is('deletado_em', null)
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Atualizar imóvel
  async atualizarImovel(id: string, dados: any) {
    const { data, error } = await this.supabase
      .from('imoveis')
      .update({ ...dados, atualizado_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Soft delete
  async removerImovel(id: string) {
    const { error } = await this.supabase
      .from('imoveis')
      .update({ deletado_em: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  // Alternar destaque
  async toggleDestaque(id: string, destaque: boolean) {
    const { error } = await this.supabase
      .from('imoveis')
      .update({ destaque })
      .eq('id', id);

    if (error) throw error;
  }
  async getUser() {
    return this.supabase.auth.getUser();
  }
}