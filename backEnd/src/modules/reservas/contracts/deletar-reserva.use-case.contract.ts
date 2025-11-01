export type DeletarReservaResult = boolean

export interface IDeletarReservaUseCase {
    execute(id: number): Promise <DeletarReservaResult>;

}