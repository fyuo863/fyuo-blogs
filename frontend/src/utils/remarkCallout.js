// ── Remark plugin: 解析 Obsidian 风格 > [!type] callout ──

const CALLOUT_RE = /^\[!(\w+)\]\s*(.*)/;

function walk(node, fn) {
  if (!node || typeof node !== "object") return;
  fn(node);
  if (node.children) node.children.forEach((c) => walk(c, fn));
}

export default function remarkCallout() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== "blockquote") return;
      const children = node.children;
      if (!children?.length) return;

      const first = children[0];
      if (first.type !== "paragraph") return;
      const textChild = first.children?.[0];
      if (textChild?.type !== "text") return;

      const match = textChild.value.match(CALLOUT_RE);
      if (!match) return;

      const type = match[1].toLowerCase();
      const title = match[2] || type.charAt(0).toUpperCase() + type.slice(1);

      // 去掉 [!type] 前缀
      const rest = textChild.value.slice(match[0].length).replace(/^\s*/, "");
      if (rest) {
        textChild.value = rest;
      } else {
        first.children.shift();
        if (!first.children.length) node.children.shift();
      }

      // 保留 blockquote 类型让 remark-rehype 正常处理子节点，仅覆盖输出标签
      node.data = {
        hName: "div",
        hProperties: {
          className: `callout callout-${type}`,
          "data-callout-title": title,
        },
      };
    });
  };
}
