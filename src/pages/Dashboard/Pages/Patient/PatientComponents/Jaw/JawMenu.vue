<template>
    <div class="tooth-menu__wrapper" :class="direction + '-tooth-menu__wrapper'">
        <!-- :md-offset-x="127+offset"
        :md-offset-y="-36"-->
        <md-menu
            :md-offset-x="127 + offset"
            :md-close-on-select="false"
            md-align-trigger
            md-size="medium"
            :md-direction="`${direction}-start`"
            @md-opened="opened = !opened"
            @md-closed="opened = !opened"
        >
            <!-- :disabled="items.length === 0 && !hasOtherItemTypes" -->
            <md-button
                v-if="!printMode"
                :disabled="lodash.isEmpty(items)"
                :class="[
                    { 'has-items': items[type] && items[type].length > 0 },
                    { [type]: items[type] && items[type].length > 0 },
                    { [btnClass]: items[type] && items[type].length > 0 },
                    { 'md-simple': items[type] && items[type].length == 0 && hasOtherItemTypes },
                    { 'tooth-selected': selected },
                    { 'has-other-items': hasOtherItemTypes },
                    { circle: opened }
                ]"
                class="md-button t-tooth-button md-round dropdown-toggle"
                :style="{
                    maxWidth: !printMode ? `${buttonWidth}em` : '22px',
                    minWidth: !printMode ? `${buttonWidth}em` : '22px',
                    maxHeight: !printMode ? `${buttonWidth}em` : '22px',
                    minHeight: !printMode ? `${buttonWidth}em` : '22px',
                    borderRdius: 20 + 'px',
                    fontSize: !printMode ? '0.8em' : '12px'
                }"
                md-menu-trigger
            >
                {{ toothId | toCurrentTeethSystem }}
            </md-button>
            <span v-else>
                {{ toothId | toCurrentTeethSystem }}
            </span>

            <md-menu-content class="md-select-menu">
                <template v-for="(subItems, name, index) in items">
                    <md-menu-item :key="index" class="tooth-menu-item item-categoty">
                        <b>{{ $t(`${$options.name}.${name}`) }}:</b>
                    </md-menu-item>
                    <md-menu-item
                        v-for="(item, key) in subItems"
                        :key="`${key}${index}`"
                        class="tooth-menu-item"
                        :md-ripple="false"
                        :class="[{ 'no-locations': item.hasLocations }, { [`tooth-${name}-content`]: true }]"
                        @click="menuClick($event, item, toothId, name)"
                    >
                        <div class="tooth-diagnosis-content__item">
                            <div class="tooth-items-code">
                                <span>
                                    <b>{{ item.code }}</b>
                                </span>
                            </div>
                            <div class="tooth-diagnosis-text">
                                <span class="tooth-diagnosis-text-item">
                                    <span>{{ item.title }}</span>
                                </span>
                            </div>
                        </div>

                        <div v-show="item.hasLocations" class="tooth-diagnosis-actions">
                            <md-button
                                :class="[{ 'md-info': item.showInJaw }]"
                                class="md-just-icon md-simple md-round"
                                @click.stop="toggleItemVisibility(item, name)"
                            >
                                <md-icon v-if="item.showInJaw">
                                    visibility
                                </md-icon>
                                <md-icon v-else>
                                    visibility_off
                                </md-icon>
                            </md-button>
                        </div>
                    </md-menu-item>
                </template>
            </md-menu-content>
        </md-menu>
    </div>
</template>
<script>
// import { tObjProp } from '@/mixins';
import { mapGetters } from 'vuex';
import { PATIENT_ITEM_VISIBILITY_TOGGLE, STORE_KEY_PATIENT, EB_SHOW_ITEM_WIZARD } from '@/constants';
import EventBus from '@/plugins/event-bus';

export default {
    name: 'JawMenu',
    props: {
        printMode: {
            type: Boolean,
            default: () => false
        },
        selected: {
            type: Boolean,
            default: () => false
        },
        btnClass: {
            type: String,
            default: () => 'md-primary'
        },
        toothId: {
            type: String,
            default: () => ''
        },
        teethSystem: {
            type: Number,
            default: () => 1
        },
        windowWidth: {
            type: Number,
            default: () => 1
        },
        direction: {
            type: String,
            default: () => 'top'
        },
        align: {
            type: String,
            default: () => 'center'
        },
        type: {
            type: String,
            default: () => 'diagnosis'
        },
        offset: {
            type: Number,
            default: () => 5
        }
    },
    data() {
        return {
            opened: false,
            hover: ''
        };
    },
    computed: {
        ...mapGetters({
            diagnosis: `${STORE_KEY_PATIENT}/getPatientDiagnosis`,
            anamnesis: `${STORE_KEY_PATIENT}/getPatientAnamnesis`,
            procedures: `${STORE_KEY_PATIENT}/getPatientCurrentPlanProcedures`,
            getCurrentClinicOriginalItem: 'getCurrentClinicOriginalItem'
        }),
        items() {
            let items = {};
            const patientItems = {
                diagnosis: this.diagnosis,
                anamnesis: this.anamnesis,
                procedures: this.procedures
            };
            Object.keys(patientItems).forEach(itemType => {
                patientItems[itemType].forEach(patientItemW => {
                    if (patientItemW.teeth && this.toothId in patientItemW.teeth) {
                        if (!(itemType in items)) {
                            items[itemType] = [];
                        }
                        items[itemType].push({
                            //!удалить после реализации code  на бэкенде
                            // code: this.getItemSCode(patientItemW),
                            hasLocations: !this.lodash.isEmpty(patientItemW.teeth[this.toothId]),
                            ...patientItemW
                        });
                    }
                });
            });
            return items;
        },
        hasOtherItemTypes() {
            let hasItems = false;
            Object.keys(this.items).forEach(category => {
                if (category !== this.type && this.items[category].length > 0) {
                    hasItems = true;
                }
            });
            return hasItems;
        },
        buttonWidth() {
            if (this.windowWidth < 600) {
                return 1.8;
            }
            if (this.windowWidth >= 600 && this.windowWidth < 960) {
                return 1.8;
            }
            if (this.windowWidth <= 1280 && this.windowWidth > 960) {
                return 1.8;
            }
            if (this.windowWidth < 1920 && this.windowWidth > 1280) {
                return 1.8;
            }
            if (this.windowWidth >= 1920) {
                return 1.8;
            }
            return 4;
        }
    },
    methods: {
        //!удалить после реализации code  на бэкенде
        getItemSCode(patientItemW) {
            let code = '';
            let catalogID = '';
            if (this.type === 'diagnosis') {
                catalogID = patientItemW.catalogDiagnoseID;
            } else if (this.type === 'procedures') {
                catalogID = patientItemW.catalogProcedureID;
            } else if (this.type === 'anamnesis') {
                catalogID = patientItemW.catalogProcedureID;
            }
            code = this.getCurrentClinicOriginalItem(this.type, catalogID).code;
            console.log(code, this.type);
            return code;
        },
        toggleItemVisibility(item, type) {
            if (item.id) {
                this.$store.dispatch(`$_patient/${PATIENT_ITEM_VISIBILITY_TOGGLE}`, {
                    params: {
                        itemId: item.id,
                        type
                    }
                });
            }
        },

        menuClick(event, item, toothId, type) {
            const params = {
                item,
                toothId,
                type
            };
            this.emitClick(params);
        },
        emitClick(params) {
            EventBus.$emit(EB_SHOW_ITEM_WIZARD, params);
        }
    }
};
</script>

