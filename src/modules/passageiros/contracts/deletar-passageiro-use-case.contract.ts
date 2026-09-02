export interface DeletarPassageiroUseCaseContract {
  execute(id: number): Promise<boolean>;
}
