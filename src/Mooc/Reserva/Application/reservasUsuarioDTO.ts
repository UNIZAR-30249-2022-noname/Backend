export class Scheduled{
    constructor(public hour: number, public min: number){}
}

export class ReservasUsuarioDTO {

    constructor(
      public slot: string,
      public day: string,
      public event: string,
      public scheduled: Scheduled[],
      public owner: string,
      public key: string,
    ) {}
  }