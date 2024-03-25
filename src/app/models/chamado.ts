export class Chamado {

    constructor(
      public id: number,
      public idCliente?: number,
      public idAdmin?: number,
      public assunto?: string,
      public resposta?: string,
      public situacao?: string,
      public avaliacao?: number
    ) {}
}
