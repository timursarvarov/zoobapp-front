/* eslint-disable consistent-return */
import { TEETH_SCHEMA } from "@/constants";
import store from "@/store";

export default function toCurrentTeethSystem(toothID, returnName = false) {
    const currentSystem = store.getters.getCurrentClinic.teethSystem;
    if (typeof toothID === "undefined") {
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

    function getName(schema, id) {
        if (schema[id]) {
            if (schema[id].name) {
                return schema[id].name;
            }
            return toothID;
        }
        return toothID;
    }
    if (returnName) {
        const name = getName(TEETH_SCHEMA, toothID) || toothID;
        return name;
    }
    let system = "fdi";
    if (currentSystem === 1) {
        system = "fdi";
    } else if (currentSystem === 2) {
        system = "universal";
    } else if (currentSystem === 3) {
        system = "palmer";
    }
    const id = getID(TEETH_SCHEMA, toothID, system) || toothID;
    return id;
}
