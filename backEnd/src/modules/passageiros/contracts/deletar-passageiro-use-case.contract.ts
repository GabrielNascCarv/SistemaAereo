export type DeletarPassageiroResult = boolean

export interface IDeletarPassageiroUseCase {
  execute(id: number): Promise<DeletarPassageiroResult>;
}