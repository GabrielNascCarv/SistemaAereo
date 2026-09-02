export interface DeletarReservaUseCaseContract {
  execute(id: number): Promise<boolean>;
}
