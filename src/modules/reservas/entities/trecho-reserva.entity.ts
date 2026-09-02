import { VooEntity } from '../../voos/entities/voo.entity';

export class TrechoReservaEntity {
  constructor(
    public readonly id: number,
    public readonly vooId: number,
    public readonly direcao: 'IDA' | 'VOLTA',
    public readonly ordem: number,
    public readonly voo: VooEntity,
  ) {}

  static create(data: {
    id: number;
    vooId: number;
    direcao: 'IDA' | 'VOLTA';
    ordem: number;
    voo: VooEntity;
  }): TrechoReservaEntity {
    return new TrechoReservaEntity(
      data.id,
      data.vooId,
      data.direcao,
      data.ordem,
      data.voo,
    );
  }
}
