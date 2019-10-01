<template>
    <md-dialog class="t-table-editor-form" :md-active.sync="showFormLocal">
        <md-card>
            <md-card-header class="md-card-header-icon md-card-header-green">
                <div class="card-icon">
                    <md-icon>{{ icon }}</md-icon>
                </div>
                <h4 class="title">
                    {{ title }}
                </h4>
            </md-card-header>
            <md-card-content>
                <div class="group-wrapper" style="overflow-x: auto">
                    <div class="groups md-layout">
                        <div class="group md-layout-item md-size-100">
                            <md-toolbar class="md-transparent">
                                <h3 class="md-title">
                                    {{ $t(`${$options.name}.currentColumns`) }}
                                </h3>
                            </md-toolbar>

                            <Container
                                group-name="1"
                                :get-child-payload="getChildPayload1"
                                drag-handle-selector=".column-drag-handle"
                                orientation="horizontal"
                                behaviour="contain"
                                @drop="onDrop('newColumns', $event)"
                            >
                                <Draggable v-for="item in newColumns" :key="item.key">
                                    <div class="draggable-item-horizontal">
                                        <div class="rotate">
                                            <span class="column-drag-title">
                                                {{ $t(`${$options.name}.${item.key}`) }}
                                            </span>
                                            <span class="column-drag-handle">
                                                <md-icon>drag_indicator</md-icon>
                                            </span>
                                        </div>
                                    </div>
                                </Draggable>
                            </Container>
                        </div>

                        <div class="group md-layout-item md-size-100">
                            <md-toolbar class="md-transparent">
                                <h3 class="md-title">
                                    {{ $t(`${$options.name}.availableColumns`) }}
                                </h3>
                            </md-toolbar>
                            <Container
                                group-name="1"
                                class="md-layout"
                                :get-child-payload="getChildPayload2"
                                drag-handle-selector=".column-drag-handle"
                                orientation="horizontal"
                                behaviour="contain"
                                @drop="onDrop('availableColumns', $event)"
                            >
                                <Draggable v-for="item in availableColumns" :key="item.key">
                                    <div class="draggable-item-horizontal">
                                        <div class="rotate">
                                            <span class="column-drag-title" style>
                                                {{ $t(`${$options.name}.${item.key}`) }}
                                            </span>
                                            <span class="column-drag-handle" style>
                                                <md-icon>drag_indicator</md-icon>
                                            </span>
                                        </div>
                                    </div>
                                </Draggable>
                            </Container>
                        </div>
                    </div>
                </div>
                <small>{{ $t(`${$options.name}.hint`) }}</small>
            </md-card-content>
            <md-card-actions>
                <md-button @click="showFormLocal = !showFormLocal">
                    {{ $t(`${$options.name}.cancel`) }}
                </md-button>
                <md-button class="md-success" @click="(showFormLocal = !showFormLocal), setColumns()">
                    {{ $t(`${$options.name}.save`) }}
                </md-button>
            </md-card-actions>
        </md-card>
    </md-dialog>
</template>
<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import { applyDrag, generateItems } from '@/utils/helpers';

export default {
    name: 'TTableEditor',
    prop: 'Columns',
    components: {
        Container,
        Draggable
    },
    props: {
        buttonColor: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'add_a_photo'
        },
        showForm: {
            type: Boolean,
            default: () => false
        },
        title: {
            type: String,
            default: ''
        },
        availableTableColumns: {
            type: Array,
            default: () => []
        },
        tableColumns: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            items1: generateItems(15, i => ({
                id: `1${i}`,
                data: `Draggable 1 - ${i}`
            })),
            items2: generateItems(15, i => ({
                id: `2${i}`,
                data: `Draggable 2 - ${i}`
            })),
            newTableColumn: null,
            newColumns: [],
            availableColumns: []
        };
    },
    computed: {
        showFormLocal: {
            // геттер:
            get() {
                return this.showForm;
            },
            // сеттер:
            set(newValue) {
                this.$emit('update:showForm', newValue);
            }
        }
    },
    mounted() {
        this.newColumns = Object.keys(this.tableColumns).map(i => this.tableColumns[i]);
        const vm = this;
        this.availableColumns = this.availableTableColumns.filter(el => !vm.newColumns.some(f => f.key === el.key));
    },
    methods: {
        shouldAcceptDrop() {
            return true;
        },
        onDrop(collection, dropResult) {
            this[collection] = applyDrag(this[collection], dropResult);
        },
        getChildPayload1(index) {
            return this.newColumns[index];
        },
        getChildPayload2(index) {
            return this.availableColumns[index];
        },
        getColorButton(buttonColor) {
            return `md-${buttonColor}`;
        },
        setColumns() {
            this.$emit('selected', this.newColumns);
        }
    }
};
</script>
