<template>
    <div class="editor">
        <editor-menu-bar
            v-slot="{ commands, isActive }"
            :editor="editor"
        >
            <div class="wuswug-header">
                <md-toolbar class="md-transparent md-layout">
                    <div class="md-layout-item">
                        <slot name="start" />
                    </div>
                    <div class="md-layout-item">
                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.bold() }"
                            @click="commands.bold"
                        >
                            <md-icon>format_bold</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.italic() }"
                            @click="commands.italic"
                        >
                            <md-icon>format_italic</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.strike() }"
                            @click="commands.strike"
                        >
                            <md-icon>format_strikethrough</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.underline() }"
                            @click="commands.underline"
                        >
                            <md-icon>format_underline</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.paragraph() }"
                            @click="commands.paragraph"
                        >
                            <md-icon>format_textdirection_l_to_r</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.heading({ level: 1 }) }"
                            @click="commands.heading({ level: 1 })"
                        >
                            <small>H1</small>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.heading({ level: 2 }) }"
                            @click="commands.heading({ level: 2 })"
                        >
                            <small>H2</small>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.heading({ level: 3 }) }"
                            @click="commands.heading({ level: 3 })"
                        >
                            <small>H3</small>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.bullet_list() }"
                            @click="commands.bullet_list"
                        >
                            <md-icon>format_list_bulleted</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.ordered_list() }"
                            @click="commands.ordered_list"
                        >
                            <md-icon>format_list_numbered</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            :class="{ 'md-primary': isActive.blockquote() }"
                            @click="commands.blockquote"
                        >
                            <md-icon>format_quote</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            @click="commands.horizontal_rule"
                        >
                            <md-icon>border_horizontal</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            @click="commands.undo"
                        >
                            <md-icon>undo</md-icon>
                        </md-button>

                        <md-button
                            class="md-simple md-just-icon md-round"
                            @click="commands.redo"
                        >
                            <md-icon>redo</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>
            </div>
        </editor-menu-bar>
        <editor-content
            class="md-layout-item"
            :autofocus="true"
            :editor="editor"
            placeholder="Write something …"
        />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
    Blockquote,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Italic,
    Link,
    Strike,
    Underline,
    History,
    Placeholder,
} from 'tiptap-extensions';

export default {
    name: 'TWuswug',
    components: {
        EditorContent,
        EditorMenuBar,
    },
    props: {
        content: {
            type: String,
            default: () => '',
        },
        contentDescription: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            editor: new Editor({
                extensions: [
                    new Blockquote(),
                    new BulletList(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new HorizontalRule(),
                    new ListItem(),
                    new OrderedList(),
                    new TodoItem(),
                    new TodoList(),
                    new Link(),
                    new Bold(),
                    new Italic(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new Placeholder({
                        emptyNodeClass: 'is-empty',
                        emptyNodeText: 'Write something …',
                        showOnlyWhenEditable: true,
                    }),
                ],
                content: this.content,
                onUpdate: ({ getHTML }) => {
                    this.$emit('input', getHTML());
                },
            }),
        };
    },
    watch: {
        content(val) {
            // so cursor doesn't jump to start on typing
            if (val !== this.editor.getHTML()) {
                this.editor.setContent(val);
            }
        },
        contentDescription(val) {
            // so cursor doesn't jump to start on typing
            if (val !== this.editor.getHTML()) {
                this.editor.setContent(val);
            }
        },
    },
    mounted() {
        this.editor.setContent(this.content);
    },
    beforeDestroy() {
        this.editor.destroy();
    },
};
</script>
<style lang="scss">
.editor p.is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
}
</style>
