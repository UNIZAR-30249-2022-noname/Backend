import { 
    BaseDomainEntity, 
    Entity, 
    UniqueEntityID, 
    Result
  } from 'types-ddd';

interface EspacioProps extends BaseDomainEntity {
    Name: string;
    Capacity: number;  
    Building: string;
    Kind: string;
}

export class Espacio extends Entity<EspacioProps> {


    constructor(props: EspacioProps) {
        super(props,Espacio.name);
    }
}