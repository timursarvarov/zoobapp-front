<template>
    <md-dialog
        class="t-table-editor-form"
        :md-active.sync="showFormLocal"
    >
        <div>
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
                    <div
                        class="group-wrapper"
                        style="overflow-x: auto"
                    >
                        <div class="groups md-layout">
                            <div class="group md-layout-item md-size-100">
                                <md-toolbar class="md-transparent">
                                    <h3 class="md-title">
                                        Current columns
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
                                    <Draggable
                                        v-for="item in newColumns"
                                        :key="item.key"
                                    >
                                        <div
                                            v-ripple
                                            class="draggable-item-horizontal"
                                        >
                                            <md-subheader class="rotate">
                                                {{ item.title }}
                                                <span
                                                    class="column-drag-handle"
                                                    style=""
                                                >
                                                    <md-icon>drag_indicator</md-icon>
                                                </span>
                                            </md-subheader>
                                        </div>
                                    </Draggable>
                                </Container>
                            </div>

                            <div class="group md-layout-item md-size-100">
                                <md-toolbar class="md-transparent">
                                    <h3 class="md-title">
                                        Available columns
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
                                    <Draggable
                                        v-for="item in availableColumns"
                                        :key="item.key"
                                    >
                                        <div
                                            v-ripple
                                            class="draggable-item-horizontal"
                                        >
                                            <md-subheader class="rotate">
                                                {{ item.title }}
                                                <span
                                                    class="column-drag-handle"
                                                    style=""
                                                >
                                                    <md-icon>drag_indicator</md-icon>
                                                </span>
                                            </md-subheader>
                                        </div>
                                    </Draggable>
                                </Container>
                            </div>
                        </div>
                    </div>
                    <small>Drag and drop to order and add new column to the table</small>
                </md-card-content>
                <md-card-actions>
                    <md-button @click="showFormLocal = !showFormLocal">
                        Cancel
                    </md-button>
                    <md-button
                        class="md-success"
                        @click="showFormLocal = !showFormLocal, setColumns()"
                    >
                        Save
                    </md-button>
                </md-card-actions>
            </md-card>
        </div>
    </md-dialog>
</template>
<script>
import { Container, Draggable } from 'vue-smooth-dnd';
import { applyDrag, generateItems } from '@/utils/helpers';

export default {
    name: 'TableSettings',
    prop: 'Columns',
    components: {
        Container,
        Draggable,
    },
    props: {
        buttonColor: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: 'add_a_photo',
        },
        showForm: {
            type: Boolean,
            default: () => false,
        },
        title: {
            type: String,
            default: '',
        },
        availableTableColumns: {
            type: Array,
            default: () => [],
        },
        tableColumns: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            items1: generateItems(15, i => ({
                id: `1${i}`,
                data: `Draggable 1 - ${i}`,
            })),
            items2: generateItems(15, i => ({
                id: `2${i}`,
                data: `Draggable 2 - ${i}`,
            })),
            newTableColumn: null,
            newColumns: [
                {
                    key: 'ID1',
                    title: 'ID',
                },
                {
                    key: 'address1',
                    title: 'Address',
                },
            ],
            availableColumns: [],
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
            },
        },
    },
    mounted() {
        this.newColumns = Object.keys(this.tableColumns).map(
            i => this.tableColumns[i],
        );
        const vm = this;
        this.availableColumns = this.availableTableColumns.filter(
            el => !vm.newColumns.some(f => f.key === el.key),
        );
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
        },
    },
};
</script>
<style lang="scss">
.group-wrapper {
  max-height: 80vh;
  overflow-y: auto;
  border-style: solid;
  border-color: rgba(128, 128, 128, 0.212);
  border-width: 1px;
  border-radius: 3px;
  background-color: rgba(238, 236, 236, 0.301);
}
.groups {
  display: flex;
  justify-content: stretch;
  margin-right: 50px;
  .draggable-item-horizontal {
    margin: 5px;
    height: 150px;
    line-height: 50px;
    width: 50px;
     position: relative;
    margin-bottom: 2px;
    margin-top: 2px;
    user-select: none;
    text-align: center;
    display: block;
    background-color: #fff;
    outline: 0;
    border: 1px solid rgba(128, 128, 128, 0.212);
    border-radius: 3px;
    transition-duration: 0.4s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0s;
    -webkit-box-shadow: 0 0 0px 1000px rgb(255, 255, 255) inset;
    transition: background-color 5000s ease-in-out 0s;
    .rotate {
        position: absolute;
        display: inline-block;
        bottom: 0px;
        width: 150px;
        text-align: right;
        transform: rotate(-90deg) translateY(50%);
        transform-origin: left bottom;
        margin: 0px;
        padding: 0px;
        .md-icon{
          transform: rotate(-90deg);
          margin: 10px;
        }
    }
    .column-drag-handle {
      cursor: move; /* fallback if grab cursor is unsupported */
      cursor: grab;
      cursor: -moz-grab;
      cursor: -webkit-grab;
      &:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
      }
    }
  }
}
.group {
  margin-left: 50px;
  flex: 1;
}
.md-dialog.t-table-editor-form {
  background-color: transparent !important;
  box-shadow: none !important;
  justify-content: center;
  top: 0;
  left: 0;
  min-width: 0;
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  transform: none;

  .md-dialog-container {
    max-width: 70%;
  }
  .md-field:not(.md-chips) {
    margin-top: 10px;
  }
  .t-table-editor {
    margin-bottom: 30px;
    // max-height: 40vh;
    // overflow-y: auto;
    overflow-x: auto;
    &::-webkit-scrollbar {
      width: 7px;
      // background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: grey;
      border-radius: 20px;
    }
  }
}
</style>
