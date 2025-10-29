export type TDeletarVooUseCaseParams = {
    id: number;
};

export interface IDeletarVooUseCaseContract {
    execute(params: TDeletarVooUseCaseParams): Promise<boolean>;
}