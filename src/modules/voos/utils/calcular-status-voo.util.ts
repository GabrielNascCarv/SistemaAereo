export function vooDeveSerConcluido(voo: {
  status: string;
  dataChegada: Date;
}): boolean {
  return voo.status === 'AGENDADO' && voo.dataChegada.getTime() < Date.now();
}
