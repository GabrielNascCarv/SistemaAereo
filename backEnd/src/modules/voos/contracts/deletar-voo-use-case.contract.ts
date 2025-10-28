export interface DeletarVooUseCaseContract {
    execute(id: number): Promise<boolean>;
}