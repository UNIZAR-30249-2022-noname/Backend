export class Scheduled{
    constructor(public hour: number, public min: number){}
}

export class ReservasUsuarioDTO {

    constructor(
      public space: string,
      public day: string,
      public event: string,
      public scheduled: Scheduled[],
      public owner: string,
      public key: string,
    ) {}
  }