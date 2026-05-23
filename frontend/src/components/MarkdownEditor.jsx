import { useEffect, useRef } from "react";
import { RangeSetBuilder } from "@codemirror/state";
import { EditorView, keymap, Decoration, ViewPlugin } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";

// ── 隐藏标记符的 ViewPlugin（Live Preview 核心） ──
const hiddenMarkup = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = this.build(view);
    }

    update(update) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view) {
      const builder = new RangeSetBuilder();
      const cursorLine = view.state.doc.lineAt(
        view.state.selection.main.head
      ).number;

      for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from,
          to,
          enter(node) {
            const line = view.state.doc.lineAt(node.from).number;
            const onCursorLine = line === cursorLine;

            // 标题标记符 #
            if (node.name === "HeadingMark" && !onCursorLine) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }

            // 粗体 / 斜体 / 删除线 / 行内代码 标记符
            const inlineMarks = [
              "EmphasisMark",
              "StrongEmphasisMark",
              "StrikethroughMark",
              "CodeMark",
            ];
            if (inlineMarks.includes(node.name) && !onCursorLine) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }

            // 链接标记符 [ ] ( )
            if (
              (node.name === "LinkMark" || node.name === "LinkTitle") &&
              !onCursorLine
            ) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }

            // 链接 URL：隐藏 URL 部分
            if (node.name === "URL" && !onCursorLine) {
              const parent = node.node.parent;
              if (parent?.name === "Link") {
                builder.add(node.from, node.to, Decoration.replace({}));
              }
            }

            // 图片语法
            if (node.name === "ImageMark" && !onCursorLine) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }

            // 引用标记符 >
            if (node.name === "QuoteMark" && !onCursorLine) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }

            // 列表标记符 - * 1.
            if (node.name === "ListMark" && !onCursorLine) {
              builder.add(node.from, node.to, Decoration.replace({}));
            }
          },
        });
      }

      return builder.finish();
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

// ── 暗色主题 ──
const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "#d4d4d4",
      fontSize: "15px",
      lineHeight: "1.8",
    },
    ".cm-content": {
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: "0",
      minHeight: "60vh",
    },
    ".cm-cursor": {
      borderLeftColor: "#fff",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(255,255,255,0.12)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      color: "#555",
      border: "none",
    },
    ".cm-scroller": {
      overflow: "hidden",
    },
    "&.cm-editor": {
      outline: "none",
    },
  },
  { dark: true }
);

// ── 将 CodeMirror 主题样式中的 heading 等节点渲染为加权样式 ──
const headingTheme = EditorView.baseTheme({
  ".cm-heading": {
    fontWeight: "bold",
    color: "#fff",
  },
  ".cm-heading1": {
    fontSize: "2em",
    marginTop: "1.2em",
  },
  ".cm-heading2": {
    fontSize: "1.5em",
    marginTop: "1em",
  },
  ".cm-heading3": {
    fontSize: "1.17em",
  },
  ".cm-strong": {
    fontWeight: "bold",
    color: "#fff",
  },
  ".cm-emphasis": {
    fontStyle: "italic",
  },
  ".cm-link": {
    color: "#7ea6ff",
    textDecoration: "underline",
  },
  ".cm-code": {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: "2px 4px",
    borderRadius: "3px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.9em",
  },
  ".cm-strikethrough": {
    textDecoration: "line-through",
  },
  ".cm-blockquote": {
    borderLeft: "2px solid #555",
    paddingLeft: "1em",
    color: "#999",
  },
});

export default function MarkdownEditor({ value, onChange, editorRef }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const view = new EditorView({
      doc: value,
      parent: hostRef.current,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        history(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        markdown(),
        hiddenMarkup,
        darkTheme,
        headingTheme,
        EditorView.lineWrapping,
      ],
    });

    if (editorRef) editorRef.current = view;

    return () => {
      if (editorRef) editorRef.current = null;
      view.destroy();
    };
  }, []);

  return <div ref={hostRef} />;
}
