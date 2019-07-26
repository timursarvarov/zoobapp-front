<template>
    <div class="jaw">
        <md-button @click="print()">ok</md-button>
        <tooth11 ref="11"/>
        <tooth12 ref="12"/>
        <tooth13 ref="13"/>
        <tooth14 ref="14"/>
        <tooth15 ref="15"/>
        <tooth16 ref="16"/>
        <tooth17 ref="17"/>
        <tooth18 ref="18"/>
        <tooth41 ref="41"/>
        <tooth42 ref="42"/>
        <tooth43 ref="43"/>
        <tooth44 ref="44"/>
        <tooth45 ref="45"/>
        <tooth46 ref="46"/>
        <tooth47 ref="47"/>
        <tooth48 ref="48"/>
        <tooth21 ref="21"/>
        <tooth22 ref="22"/>
        <tooth23 ref="23"/>
        <tooth24 ref="24"/>
        <tooth25 ref="25"/>
        <tooth26 ref="26"/>
        <tooth27 ref="27"/>
        <tooth28 ref="28"/>
        <tooth31 ref="31"/>
        <tooth32 ref="32"/>
        <tooth33 ref="33"/>
        <tooth34 ref="34"/>
        <tooth35 ref="35"/>
        <tooth36 ref="36"/>
        <tooth37 ref="37"/>
        <tooth38 ref="38"/>
        <tooth51 ref="51"/>
        <tooth52 ref="52"/>
        <tooth53 ref="53"/>
        <tooth54 ref="54"/>
        <tooth55 ref="55"/>
        <tooth61 ref="61"/>
        <tooth62 ref="62"/>
        <tooth63 ref="63"/>
        <tooth64 ref="64"/>
        <tooth65 ref="65"/>
        <tooth71 ref="71"/>
        <tooth72 ref="72"/>
        <tooth73 ref="73"/>
        <tooth74 ref="74"/>
        <tooth75 ref="75"/>
        <tooth81 ref="81"/>
        <tooth82 ref="82"/>
        <tooth83 ref="83"/>
        <tooth84 ref="84"/>
        <tooth85 ref="85"/>
    </div>
</template>
<script>
    import tooth11 from './teeth/11tooth.svg';
    import tooth12 from './teeth/12tooth.svg';
    import tooth13 from './teeth/13tooth.svg';
    import tooth14 from './teeth/14tooth.svg';
    import tooth15 from './teeth/15tooth.svg';
    import tooth16 from './teeth/16tooth.svg';
    import tooth17 from './teeth/17tooth.svg';
    import tooth18 from './teeth/18tooth.svg';
    import tooth41 from './teeth/41tooth.svg';
    import tooth42 from './teeth/42tooth.svg';
    import tooth43 from './teeth/43tooth.svg';
    import tooth44 from './teeth/44tooth.svg';
    import tooth45 from './teeth/45tooth.svg';
    import tooth46 from './teeth/46tooth.svg';
    import tooth47 from './teeth/47tooth.svg';
    import tooth48 from './teeth/48tooth.svg';
    import tooth21 from './teeth/21tooth.svg';
    import tooth22 from './teeth/22tooth.svg';
    import tooth23 from './teeth/23tooth.svg';
    import tooth24 from './teeth/24tooth.svg';
    import tooth25 from './teeth/25tooth.svg';
    import tooth26 from './teeth/26tooth.svg';
    import tooth27 from './teeth/27tooth.svg';
    import tooth28 from './teeth/28tooth.svg';
    import tooth31 from './teeth/31tooth.svg';
    import tooth32 from './teeth/32tooth.svg';
    import tooth33 from './teeth/33tooth.svg';
    import tooth34 from './teeth/34tooth.svg';
    import tooth35 from './teeth/35tooth.svg';
    import tooth36 from './teeth/36tooth.svg';
    import tooth37 from './teeth/37tooth.svg';
    import tooth38 from './teeth/38tooth.svg';
    import tooth51 from './teeth/51tooth.svg';
    import tooth52 from './teeth/52tooth.svg';
    import tooth53 from './teeth/53tooth.svg';
    import tooth54 from './teeth/54tooth.svg';
    import tooth55 from './teeth/55tooth.svg';
    import tooth61 from './teeth/61tooth.svg';
    import tooth62 from './teeth/62tooth.svg';
    import tooth63 from './teeth/63tooth.svg';
    import tooth64 from './teeth/64tooth.svg';
    import tooth65 from './teeth/65tooth.svg';
    import tooth71 from './teeth/71tooth.svg';
    import tooth72 from './teeth/72tooth.svg';
    import tooth73 from './teeth/73tooth.svg';
    import tooth74 from './teeth/74tooth.svg';
    import tooth75 from './teeth/75tooth.svg';
    import tooth81 from './teeth/81tooth.svg';
    import tooth82 from './teeth/82tooth.svg';
    import tooth83 from './teeth/83tooth.svg';
    import tooth84 from './teeth/84tooth.svg';
    import tooth85 from './teeth/85tooth.svg';
    import { TEETH_ALL, TEETH_DEFAULT_LOCATIONS } from '@/constants';

    export default {
        name: 'jaw-svg-generator',
        data() {
            return {};
        },
        components: {
            tooth11,
            tooth12,
            tooth13,
            tooth14,
            tooth15,
            tooth16,
            tooth17,
            tooth18,
            tooth41,
            tooth42,
            tooth43,
            tooth44,
            tooth45,
            tooth46,
            tooth47,
            tooth48,
            tooth21,
            tooth22,
            tooth23,
            tooth24,
            tooth25,
            tooth26,
            tooth27,
            tooth28,
            tooth31,
            tooth32,
            tooth33,
            tooth34,
            tooth35,
            tooth36,
            tooth37,
            tooth38,
            tooth51,
            tooth52,
            tooth53,
            tooth54,
            tooth55,
            tooth61,
            tooth62,
            tooth63,
            tooth64,
            tooth65,
            tooth71,
            tooth72,
            tooth73,
            tooth74,
            tooth75,
            tooth81,
            tooth82,
            tooth83,
            tooth84,
            tooth85,
        },
        computed: {
            locations() {
                return Object.keys(TEETH_DEFAULT_LOCATIONS);
            },
            teeth() {
                return TEETH_ALL;
            },
        },
        methods: {
            click(w) {
                console.log(w);
            },
            getClasses(cclass) {
                const classes = {};
                classes[cclass] = true;
                return classes;
            },
            print() {
                const SvgTeeth = {};
                this.teeth.forEach((toothId) => {
                    // console.log(this.$refs[`${toothId}`])
                    // console.log(this.$refs[`${toothId}`].$refs)
                    const svg = this.$refs[`${toothId}`].cloneNode(true);
                    // const el = svg.childNodes[0].childNodes[0].childNodes[0];
                    if (svg) {
                        const viewBox = svg.getAttribute('viewBox');
                        const height = viewBox.split(' ')[3];
                        const widthPerc = (
                            (viewBox.split(' ')[2] / 600)
                        * 100
                        ).toFixed(2);
                        const width = viewBox.split(' ')[2];
                        SvgTeeth[toothId] = {
                            height,
                            widthPerc,
                            width,
                            viewBox,
                        };
                        this.locations.forEach((location) => {
                            const el =                            svg.childNodes[0].childNodes[0].childNodes[0];
                            const elLength = Object.keys(el.childNodes).length;
                            // console.log(elLength);
                            // console.log(typeof el.childNodes);
                            for (let i = 0; i < elLength; i += 1) {
                                const elWithClass = el.childNodes[i].getAttribute(
                                    'class',
                                );
                                const elClass = el.childNodes[i].getAttribute(
                                    'class',
                                );
                                if (elClass === location) {
                                    // console.log(el, el.childNodes[i].getAttribute('d'));
                                    SvgTeeth[toothId][location] = el.childNodes[
                                        i
                                    ].getAttribute('d');
                                }
                            }

                        // const locId = '84background';
                        // const locaElement = document.querySelector('svg');

                        // if (locaElement.length) {
                        // console.log(locaElement);
                        // }
                        // console.log(locRef, locElement);

                        // console.log(elm);
                        // console.log(elm.getAttribute('id'));
                        // if (locElement) {
                        //     SvgTeeth[toothId][location] = locElement.getAttribute('d');
                        // }
                        });
                        if (Object.keys(SvgTeeth[toothId]).length <= 47) {
                            let found = this.locations.filter(r => !Object.keys(SvgTeeth[toothId]).includes(r));
                            console.log('found', toothId, found);
                        }
                    }
                });
                console.log(JSON.stringify(SvgTeeth));
            },
        },
    };
</script>
<style lang="scss">
.jaw {
    max-height: 200px;
}
</style>
