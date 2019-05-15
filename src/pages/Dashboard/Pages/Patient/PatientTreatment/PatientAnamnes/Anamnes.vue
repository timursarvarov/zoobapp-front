<template lang="html">
  <div class="md-layout md-gutter">
      <div class="md-layout-item md-layout md-gutter md-small-size-100 md-xsmall-size-100 md-medium-size-50 md-size-50">
        <div class="mx-auto" style="flex-grow:1;" ref="wrjaw">
          <jaw
            :selectedTeeth="selectedTeeth"
            @onSelectedTeeth='onSelectedTeeth'
            @showToothInfo='showToothInfo'
            @toggleItemVisibility='toggleAnamnesVisibility'
            :jaw="jaw"
            :patientItems="patient.anamnesis"
            :teethSystem="currentClinic.teethSystem"
            type="anamnesis"
            >
            <div slot="bottom">
            </div>
          </jaw>
        </div>
      </div>
      <div class="md-layout-item md-layout md-small-size-100 md-xsmall-size-100 md-gutter md-medium-size-50 md-size-50">
        <t-collapse-search
          :style="[{'max-height': jawHeight + 'px'}]" class="set-procedure-form"
          :items="anamnesis"
          :selectedTeeth="selectedTeeth"
          :favoriteItems="favoriteAnamnesis"
          itemType="Anamnesis"
          :jawHeight="jawHeight"
          @onSetFavoritem="setFavoriteAnamnes"
          @onSelected="selectAnamnes"
          />
      </div>

        <div class="md-layout-item md-layout md-size-100" >
            <anamnesis-list
                @onJawChanged="recalculateJawAnamnes()"
                @toggleAnamnesVisibility="toggleAnamnesVisibility"
                @editAnamnes="editAnamnes"
                :teethSystem="currentClinic.teethSystem"
                class=""
            />

        <jaw-add-anamnes-wizard
            v-if="showAddAnamnesWizard"
            @on-created='saveAnamnes'
            :selectedTeeth="selectedTeeth"
            :selectedAnamnes="selectedAnamnesLocal"
            :jaw='jaw'
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :isDialogVisible.sync="showAddAnamnesWizard"
        />

        <t-tooth-Items
            v-if="showToothDiagnosis"
            @editItem="editAnamnes"
            :showForm.sync="showToothDiagnosis"
            :toothId="toothIdtoShow"
            :item="anamnesToShow"
            :patientItems="patient.anamnesis"
            :originalItems="anamnesis"
            :teethSchema="teethSchema"
            :teethSystem="currentClinic.teethSystem"
            :jaw='jaw'
            classType="anamnes"
        />

        </div>
  </div>

</template>

<script>
    import {
        NOTIFY,
        PATIENT_ANAMNES_SET,
        PATIENT_TOGGLE_ITEM_VISIBILITY,
        PATIENT_ANAMNES_UPDATE,
        USER_SET_PARAM,
        PROCEDURES,
    } from '@/constants';
    import { mapGetters } from 'vuex';
    import { TCollapseSearch, TToothItems, Jaw } from '@/components';
    import AnamnesisList from './AnamnesisList.vue';
    import JawAddAnamnesWizard from './JawAddAnamnesWizard.vue';
    import { tObjProp } from '@/mixins';

    export default {
        mixins: [tObjProp],
        components: {
            TCollapseSearch,
            Jaw,
            TToothItems,
            AnamnesisList,
            JawAddAnamnesWizard,
        },
        data() {
            return {
                showToothDiagnosis: false,
                showAddAnamnesWizard: false,
                jawHeight: 0,
                toothIdtoShow: 0,
                anamnesIdtoShow: 0,
                search: '',
                searched: [],
                selectedTeeth: [],
                firstTabs: [],
                toggleAll: false,
                fuse: false,
                filter: {},
                anamnesOriginal: [],
                users: [],
                selectedAnamnesLocal: {},
            };
        },
        methods: {
            editAnamnes(anamnes) {
                if (!this.isEmpty(anamnes.teeth)) {
                    this.selectedTeeth = Object.keys(anamnes.teeth);
                }
                this.selectedAnamnesLocal = anamnes;
                this.showAddAnamnesWizard = true;
            },
            toggleAnamnesVisibility(itemId) {
                if (itemId) {
                    this.$store.dispatch(PATIENT_TOGGLE_ITEM_VISIBILITY, {
                        params: {
                            itemId,
                            type: 'anamnesis',
                        },
                    });
                }
                this.recalculateJawAnamnes();
            },
            showToothInfo(anamnesId, toothId) {
                this.toothIdtoShow = toothId;
                this.anamnesIdtoShow = anamnesId;
                this.showToothDiagnosis = true;
            },
            setFavoriteAnamnes(anamnes) {
                const index = this.favoriteAnamnesis.findIndex(
                    a => a === anamnes.code,
                );
                if (index === -1) {
                    this.favoriteAnamnesis.unshift(anamnes.code);
                } else {
                    this.favoriteAnamnesis.splice(index, 1);
                }
                this.$store.dispatch(USER_SET_PARAM, {
                    type: 'favoriteAnamnesis',
                    value: this.favoriteAnamnesis,
                });
            },
            onSelectedTeeth(teeth) {
                this.selectedTeeth = teeth;
            },
            saveEditedAnamnes(a) {
                this.$store.dispatch(PATIENT_ANAMNES_SET, {
                    anamnes: a,
                });
                this.recalculateJawAnamnes();
            },
            saveAnamnes(a) {
                if (a.id) {
                    this.saveEditedAnamnes(a);
                    return;
                }
                const anamnesL = this.copyObj(a);
                anamnesL.date = new Date();
                anamnesL.author = {
                    ID: this.user.ID,
                    avatar: this.user.avatar,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                };
                anamnesL.showInJaw = true;
                anamnesL.id = Math.random();
                this.$store.dispatch(PATIENT_ANAMNES_SET, {
                    anamnes: anamnesL,
                });
                // this.selectedTeeth = [];
                this.recalculateJawAnamnes();
            },
            selectAnamnes(anamnes) {
                if (anamnes) {
                    if (
                        !this.isEmpty(anamnes.locations)
                        && this.selectedTeeth.length === 0
                    ) {
                        this.$store.dispatch(NOTIFY, {
                            settings: {
                                message: 'Please first select teeth',
                                type: 'warning',
                            },
                        });
                    } else {
                        Object.values(this.anamnesis).forEach((group) => {
                            group.codes.forEach((anamnesOrigin) => {
                                if (anamnesOrigin.code === anamnes.constCode) {
                                    this.selectedAnamnesLocal = anamnesOrigin;
                                }
                            });
                        });
                        this.showAddAnamnesWizard = true;
                    }
                }
            },
            matchHeight() {
                if (this.$refs.wrjaw) {
                    this.jawHeight = this.$refs.wrjaw.clientHeight;
                }
            },
            recalculateJawAnamnes() {
                if (this.jawEthalon.anamnesis) {
                    this.jaw.anamnesis = JSON.parse(
                        JSON.stringify(this.jawEthalon.anamnesis),
                    );
                    this.patient.anamnesis.forEach((anamnes) => {
                        if (anamnes.showInJaw) {
                            Object.keys(anamnes.teeth).forEach((toothId) => {
                                Object.keys(anamnes.teeth[toothId]).forEach(
                                    (kLocation) => {
                                        if (
                                            kLocation in this.jaw.anamnesis[toothId]
                                        ) {
                                            if (
                                                !anamnes.teeth[toothId][kLocation]
                                            ) {
                                                this.jaw.anamnesis[toothId][
                                                    kLocation
                                                ] = anamnes.teeth[toothId][
                                                    kLocation
                                                ];
                                            }
                                        } else {
                                            this.jaw.anamnesis[toothId][kLocation] = anamnes.teeth[toothId][kLocation];
                                        }
                                    },
                                );
                            });
                        }
                    });
                }
            },
        },
        updated() {
            this.$nextTick(() => {
                this.matchHeight();
            });
        },
        destroyed() {
            window.removeEventListener('resize', this.matchHeight);
        },
        computed: {
            ...mapGetters({
                jaw: 'jaw',
                jawEthalon: 'jawEthalon',
                patient: 'getPatient',
                favoriteAnamnesis: 'favoriteAnamnesis',
                teethSchema: 'teethSchema',
                currentClinic: 'getCurrentClinic',
                user: 'getProfile',
            }),
            anamnesToShow() {
                const a = this.patient.anamnesis.find(
                    anamnes => anamnes.id === this.anamnesIdtoShow,
                );
                return a || {};
            },
            anamnesis() {
                return PROCEDURES;
            },
        },
        mounted() {
            window.addEventListener('resize', this.matchHeight);
            this.$nextTick(() => {
                this.matchHeight();
            });
        },
    };
</script>
<style lang="scss">
.set-anamnes-form {
    .set-procedure-form {
        margin-right: 15px;
    }
    .anamnes-code {
        margin-right: 24px;
    }
    .noresult {
        color: red !important;
    }
    .md-checkbox {
        padding-top: 7px;
        margin-left: 17px;
    }
}
</style>
