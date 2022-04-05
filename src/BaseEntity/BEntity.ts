import {
    ShortDomainId,
} from 'types-ddd';

export abstract class BEntity {
    protected id: ShortDomainId;
    constructor(id: ShortDomainId) {
        this.id = id;
    }
}