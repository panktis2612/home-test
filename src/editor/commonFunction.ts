import { Editor, Transforms } from "slate";
const linkText = "link";
const LIST_TYPES = ["numbered-list", "bulleted-list"];

/**
 * check if selected input is link or not
 */
export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === linkText });
  return !!link;
};
/**
 * make simple text from link
 */
export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === linkText });
};

export const isFormatActive = (format: any, editor: any) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  const [matchTypes] = Editor.nodes(editor, {
    match: (n) => n.type === format,
    mode: "all",
  });
  return !!match || !!matchTypes;
};

const isMarkActive = (editor: any, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export function formatMark(format: string, editor: any) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const isBlockActive = (editor: any, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};

export function formatBlock(format: string, editor: any) {
  const isActive = isBlockActive(editor, format);

  if (isActive || true) {
    const isList = LIST_TYPES.includes(format);
    Transforms.unwrapNodes(editor, {
      match: (n: any) => LIST_TYPES.includes(n.type),
      split: true,
    });
    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    });
    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  }
}
