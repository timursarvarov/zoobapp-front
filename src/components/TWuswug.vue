<template>
    <div class="editor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
            <div class="md-transparent">
                <slot name="start"></slot>
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
                >H1</md-button>

                <md-button
                    class="md-simple md-just-icon md-round"
                    :class="{ 'md-primary': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                >H2</md-button>

                <md-button
                    class="md-simple md-just-icon md-round"
                    :class="{ 'md-primary': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                >H3</md-button>

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

                <md-button class="md-simple md-just-icon md-round" @click="commands.undo">
                    <md-icon>undo</md-icon>
                </md-button>

                <md-button class="md-simple md-just-icon md-round" @click="commands.redo">
                    <md-icon>redo</md-icon>
                </md-button>
            </div>
        </editor-menu-bar>

        <editor-content :autofocus='true' class="editor__content" :editor="editor"/>
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
    } from 'tiptap-extensions';

    export default {
        model: {
            prop: 'content',
            event: 'updateContent',
        },
        props: {
            content: {
                type: String,
                default: () => `  <h2>
            Hi there,
          </h2>
          <p>
            this is a very <em>basic</em> example of tiptap.
          </p>
          <pre><code>body { display: none; }</code></pre>
          <ul>
            <li>
              A regular list
            </li>
            <li>
              With regular items
            </li>
          </ul>
          <blockquote>
            It's amazing 👏
            <br />
            – mom
          </blockquote>`,
            },
        },
        components: {
            EditorContent,
            EditorMenuBar,
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
                    ],
                    content: this.contentL,
                }),
            };
        },
        computed: {
            contentL: {
                get() {
                    return this.content;
                },
                set(value) {
                    this.$emit('updateContent', value);
                },
            },
        },
        beforeDestroy() {
            this.editor.destroy();
        },
    };
</script>
