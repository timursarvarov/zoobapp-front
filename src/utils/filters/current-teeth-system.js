/* eslint-disable consistent-return */
import TEETH_SCHEMA from '@/utils/filters';

export default function toCurrentTeethSystem(toothID, currentSystem) {
    if (typeof toothID === 'undefined') {
        return;
    }
    function getID(schema, id, system) {
        if (schema[id]) {
            if (schema[id][system]) {
                return schema[id][system];
            }
            return toothID;
        }
        return toothID;
    }
    let system = 'fdi';
    if (currentSystem === 1) {
        system = 'fdi';
    } else if (currentSystem === 2) {
        system = 'universal';
    } else if (currentSystem === 3) {
        system = 'palmer';
    }
        const id = getID(TEETH_SCHEMA, toothID, system) || toothID;
        return id;
}
