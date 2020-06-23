import React from "react";
import {
  Editor as EEditor,
  createEditor,
  Node,
  Transforms,
  Range,
} from "slate";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import isUrl from "is-url";
import { DefaultElement } from "./elements";
import { isLinkActive, unwrapLink, formatMark, formatBlock } from "./commonFunction";
import { Toolbar } from "./Toolbar";
const linkText = "link";
const colorQuote = "lightgray";

/**
 *
 * @description render Blocks styling
 */
function renderElement(props: RenderElementProps) {
  const { attributes, children, element } = props;
  const value: any = element.url;
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={{
            borderLeftColor: colorQuote,
            borderLeftWidth: 3,
            borderLeftStyle: "solid",
            padding: 10,
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "link":
      return (
        <a {...attributes} href={value}>
          {children}
        </a>
      );
    default:
      return <DefaultElement {...attributes}>{children}</DefaultElement>;
  }
}
/**
 *
 * @description render leaf styling
 */
function renderLeaf(props: RenderLeafProps) {
  let { attributes, children, leaf } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = (
      <code style={{ background: colorQuote, padding: 5 }}>{children}</code>
    );
  }
  return <span {...attributes}>{children}</span>;
}

export interface EditorProps {
  value: Node[];
  onChange: (value: Node[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
}

//This is main component which contains toolbar and editor.
export function Editor(props: EditorProps) {
  const { value, onChange, ...other } = props;
  const insertLink = (editor: EEditor, url: any) => {
    if (editor.selection) {
      wrapLink(editor, url);
    }
  };

  const wrapLink = (editor: EEditor, url: any) => {
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
      type: linkText,
      url,
      children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    }
  };

  // 'withLinks' is custom hook, which check if entered data is valid URL and make that link.
  const withLinks = (editor: any) => {
    const { insertData, insertText, isInline } = editor;
    editor.isInline = (element: any) => {
      return element.type === linkText ? true : isInline(element);
    };
    editor.insertText = (text: any) => {
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertText(text);
      }
    };
    editor.insertData = (data: { getData: (arg0: string) => any }) => {
      const text = data.getData("text/plain");
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertData(data);
      }
    };
    return editor;
  };

  const editor = React.useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar
        open={true}
        handleClickIcon={(format: string) => {
          formatMark(format, editor);
        }}
        handleClickIconBlock={(format: string) => {
          formatBlock(format, editor);
        }}
        onLinkInserted={(linkText: string) => {
          insertLink(editor, linkText);
        }}
      />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        {...other}
      />
    </Slate>
  );
}

export { Node };
