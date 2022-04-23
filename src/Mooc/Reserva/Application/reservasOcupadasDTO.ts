export class ReservasOcupadasDTO {
    constructor(public hour: number, public ocupado: boolean = false, public persona: string) {}
}