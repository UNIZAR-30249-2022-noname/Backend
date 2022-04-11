import {
    ShortDomainId,
} from 'types-ddd';
import * as crypto from 'crypto';


export abstract class BEntity {
    public id: ShortDomainId;

    constructor(id: string) {
        this.id = this.generateShortID(id);
    }

    private generateShortID(id: string): ShortDomainId {
        return ShortDomainId.create( (id == null) ? crypto.randomBytes(64).toString('hex') : id);
    }
}