import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';
import { Reserva } from '../modelos/imovel';
import { UnsubscriptionError } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

interface ReservaData{
    data_inicio: string;
    data_fim: string;
}


@Injectable({ providedIn: 'root' })
export class ReservasService {
  private supabase = inject(SupabaseService);

  async buscarDatasOcupadas(imovelId: string): Promise<{ data_inicio: string; data_fim: string }[]> {
    const { data, error } = await this.supabase.client
      .from('reservas')
      .select('data_inicio, data_fim')
      .eq('imovel_id', imovelId)
      .eq('status', 'confirmada');

    if (error) throw error;
    return data ?? [];
  }

  async buscarDatasOcupadasPousada(imovelId: string): Promise<ReservaData[]>{
    const { data, error }  = await this.supabase.client
    .from('reservas').select('data_inicio, data_fim').eq('imovel_id', imovelId).eq('status','confirmada');

    if(error) throw error;
    return data ?? [];

  }

  async verificarDisponibilidade(imovelId: string, inicio: string, fim: string): Promise<boolean> {
    const { data, error } = await this.supabase.client
      .from('reservas')
      .select('id')
      .eq('imovel_id', imovelId)
      .eq('status', 'confirmada')
      .lte('data_inicio', fim)
      .gte('data_fim', inicio);

    if (error) throw error;
    return (data?.length ?? 0) === 0;
  }

  async criarReserva(reserva: Omit<Reserva, 'id' | 'criado_em'>): Promise<Reserva> {
    const { data, error } = await this.supabase.client
      .from('reservas')
      .insert([reserva])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async minhasReservas(): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('reservas')
      .select('*, imoveis(titulo, imagens, cidade, bairro)')
      .order('criado_em', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }
}