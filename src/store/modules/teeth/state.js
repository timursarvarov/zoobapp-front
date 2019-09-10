export default {
    jaw: {
        anamnesis: {},
        procedures: {},
        diagnosis: {}
    },
    jawEthalon: {},
    toothLocations: {
        rejected: undefined,
        background: undefined,
        bridge: undefined,
        root: undefined,
        rootCanal: undefined,
        coronaLingual: undefined,
        coronaLingualIncisalDistal: undefined,
        coronaLingualIncisalMiddle: undefined,
        coronaLingualIncisionMesial: undefined,
        coronaLingualMiddleDistal: undefined,
        coronaLingualMiddleMiddle: undefined,
        coronaLingualMiddleMesial: undefined,
        coronaLingualCervicalDistal: undefined,
        coronaLingualCervicalMiddle: undefined,
        coronaLingualCervicalMesial: undefined,
        coronaLabial: undefined,
        coronaLabialIncisalDistal: undefined,
        coronaLabialIncisalMiddle: undefined,
        coronaLabialIncisionMesial: undefined,
        coronaLabialMiddleDistal: undefined,
        coronaLabialMiddleMiddle: undefined,
        coronaLabialMiddleMesial: undefined,
        coronaLabialCervicalDistal: undefined,
        coronaLabialCervicalMiddle: undefined,
        coronaLabialCervicalMesial: undefined,
        implant: undefined,
        veneer: undefined,
        coronaTop: undefined,
        coronaTopBuccal: undefined,
        coronaTopMedial: undefined,
        coronaTopLingual: undefined,
        coronaTopDistal: undefined,
        coronaTopOclusial: undefined,
        silant: undefined,
        gum: undefined,
        paradontit1: undefined,
        paradontit2: undefined,
        paradontit3: undefined,
        paradontit4: undefined,
        periodontit: undefined,
        fdi: undefined,
        universal: undefined,
        palmer: undefined
    },
    teethBabyBottom: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
    teethBabyTop: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    teethBabyAll: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65, 85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
    teethAll: [
        55,
        54,
        53,
        52,
        51,
        18,
        17,
        16,
        15,
        14,
        13,
        12,
        11,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        61,
        62,
        63,
        64,
        65,
        85,
        84,
        83,
        82,
        81,
        48,
        47,
        46,
        45,
        44,
        43,
        42,
        41,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        71,
        72,
        73,
        74,
        75
    ],
    teethAdultAll: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
    teethAdultTop: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    teethAdultBottom: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
    teethSchema: {
        55: {
            fdi: 55,
            universal: 'A',
            palmer: 'E┘',
            name: 'Upper right second molar'
        },
        54: {
            fdi: 54,
            universal: 'B',
            palmer: 'D┘',
            name: 'Upper right first molar'
        },
        53: {
            fdi: 53,
            universal: 'C',
            palmer: 'C┘',
            name: 'Upper right canine'
        },
        52: {
            fdi: 52,
            universal: 'D',
            palmer: 'B┘',
            name: 'Upper right lateral incisor'
        },
        51: {
            fdi: 51,
            universal: 'E',
            palmer: 'A┘',
            name: 'Upper right central incisor'
        },

        18: {
            fdi: 18,
            universal: 1,
            palmer: '8┘',
            name: 'Upper right third molar'
        },
        17: {
            fdi: 17,
            universal: 2,
            palmer: '7┘',
            name: 'Upper right second molar'
        },
        16: {
            fdi: 16,
            universal: 3,
            palmer: '6┘',
            name: 'Upper right first molar'
        },
        15: {
            fdi: 15,
            universal: 4,
            palmer: '5┘',
            name: 'Upper right second premolar'
        },
        14: {
            fdi: 14,
            universal: 5,
            palmer: '4┘',
            name: 'Upper right first premolar'
        },
        13: {
            fdi: 13,
            universal: 6,
            palmer: '3┘',
            name: 'Upper right canine'
        },
        12: {
            fdi: 12,
            universal: 7,
            palmer: '2┘',
            name: 'Upper right lateral incisor'
        },
        11: {
            fdi: 11,
            universal: 8,
            palmer: '1┘',
            name: 'Upper right central incisor'
        },

        21: {
            fdi: 21,
            universal: 9,
            palmer: '└1',
            name: 'Upper left central incisor'
        },
        22: {
            fdi: 22,
            universal: 10,
            palmer: '└2',
            name: 'Upper left lateral incisor'
        },
        23: {
            fdi: 23,
            universal: 11,
            palmer: '└3',
            name: 'Upper left canine'
        },
        24: {
            fdi: 24,
            universal: 12,
            palmer: '└4',
            name: 'Upper left first premolar'
        },
        25: {
            fdi: 25,
            universal: 13,
            palmer: '└5',
            name: 'Upper left second premolar'
        },
        26: {
            fdi: 26,
            universal: 14,
            palmer: '└6',
            name: 'Upper left first molar'
        },
        27: {
            fdi: 27,
            universal: 15,
            palmer: '└7',
            name: 'Upper left second molar'
        },
        28: {
            fdi: 28,
            universal: 16,
            palmer: '└8',
            name: 'Upper left third molar'
        },

        61: {
            fdi: 61,
            universal: 'F',
            palmer: '└A',
            name: 'Upper left central incisor'
        },
        62: {
            fdi: 62,
            universal: 'G',
            palmer: '└B',
            name: 'Upper left lateral incisor'
        },

        63: {
            fdi: 63,
            universal: 'H',
            palmer: '└C',
            name: 'Upper left canine'
        },

        64: {
            fdi: 64,
            universal: 'I',
            palmer: '└D',
            name: 'Upper left first molar'
        },
        65: {
            fdi: 65,
            universal: 'J',
            palmer: '└E',
            name: 'Upper left second molar'
        },
        85: {
            fdi: 85,
            universal: 'T',
            palmer: 'E┐',
            name: 'Lower right second molar'
        },
        84: {
            fdi: 84,
            universal: 'S',
            palmer: 'D┐',
            name: 'Lower right first molar'
        },

        83: {
            fdi: 83,
            universal: 'R',
            palmer: 'C┐',
            name: 'Lower right canine'
        },
        82: {
            fdi: 82,
            universal: 'Q',
            palmer: 'B┐',
            name: 'Lower right lateral incisor'
        },
        81: {
            fdi: 81,
            universal: 'P',
            palmer: 'A┐',
            name: 'Lower right central incisor'
        },
        38: {
            fdi: 38,
            universal: 17,
            palmer: '┌8',
            name: 'Lower left third molar'
        },
        37: {
            fdi: 37,
            universal: 18,
            palmer: '┌7',
            name: 'Lower left second molar'
        },
        36: {
            fdi: 36,
            universal: 19,
            palmer: '┌6',
            name: 'Lower left first molar'
        },
        35: {
            fdi: 35,
            universal: 20,
            palmer: '┌5',
            name: 'Lower left second premolar'
        },
        34: {
            fdi: 34,
            universal: 21,
            palmer: '┌4',
            name: 'Lower left first premolar'
        },
        33: {
            fdi: 33,
            universal: 22,
            palmer: '┌3',
            name: 'Lower left canine'
        },
        32: {
            fdi: 32,
            universal: 23,
            palmer: '┌2',
            name: 'Lower left lateral incisor'
        },
        31: {
            fdi: 31,
            universal: 24,
            palmer: '┌1',
            name: 'Lower left central incisor'
        },

        48: {
            fdi: 48,
            universal: 32,
            palmer: '8┐',
            name: 'Lower right third molar'
        },
        47: {
            fdi: 47,
            universal: 31,
            palmer: '7┐',
            name: 'Lower right second molar'
        },
        46: {
            fdi: 46,
            universal: 30,
            palmer: '6┐',
            name: 'Lower right first molar'
        },
        45: {
            fdi: 45,
            universal: 29,
            palmer: '5┐',
            name: 'Lower right second premolar'
        },
        44: {
            fdi: 44,
            universal: 28,
            palmer: '4┐',
            name: 'Lower right first premolar'
        },
        43: {
            fdi: 43,
            universal: 27,
            palmer: '3┐',
            name: 'Lower right canine'
        },
        42: {
            fdi: 42,
            universal: 26,
            palmer: '2┐',
            name: 'Lower right lateral incisor'
        },
        41: {
            fdi: 41,
            universal: 25,
            palmer: '1┐',
            name: 'Lower right central incisor'
        },

        71: {
            fdi: 71,
            universal: 'O',
            palmer: '┌A',
            name: 'Lower left central incisor'
        },
        72: {
            fdi: 72,
            universal: 'N',
            palmer: '┌B',
            name: 'Lower left lateral incisor'
        },
        73: {
            fdi: 73,
            universal: 'N',
            palmer: '┌C',
            name: 'Lower left caniner'
        },
        74: {
            fdi: 74,
            universal: 'L',
            palmer: '┌D',
            name: 'Lower left first molar'
        },
        75: {
            fdi: 75,
            universal: 'K',
            palmer: '┌E',
            name: 'Lower left second molar'
        }
    }
};
