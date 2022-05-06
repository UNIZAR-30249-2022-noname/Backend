export class ReservasOcupadasDTO {
    constructor(public hour: number, public occupied: boolean = false, public person: string) {}
}