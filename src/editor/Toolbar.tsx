import React, { useRef, useEffect } from "react";
import { ButtonGroup, IconButton, Input } from "@material-ui/core";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Close,
  Title,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { ReactEditor, useSlate } from "slate-react";
import { Range, Editor } from "slate";
import { isLinkActive, unwrapLink, isFormatActive } from "./commonFunction";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.common.black,
    borderRadius: 10,
    position: "absolute",
    zIndex: 1,
    top: "-10000px",
    left: "-10000px",
    marginTop: "-6px",
    opacity: 0.9,
  },
  button: {
    color: theme.palette.common.white,
    opacity: 0.9,
    "&:hover": {
      opacity: 1,
    },
    paddingTop: 8,
    cursor: "pointer",
    paddingBottom: 8,
  },
  input: {
    color: theme.palette.common.black,
    padding: theme.spacing(0.25, 1),
    background: "lightgrey",
    width: "100%",
  },
  close: {
    opacity: 0.75,
    cursor: "pointer",
    "&:hover": {
      opacity: 1,
    },
  },
  selectedIcon: {
    color: theme.palette.success.dark,
  },
  unselectedIcon: {
    color: theme.palette.common.white,
  },
}));

export interface ToolbarProps extends Omit<any, "children"> {
  [x: string]: any;
}

const initialValue: string | null = null;

const initialValueSelection: any = null;

export function Toolbar(props: any) {
  const [link, setLink] = React.useState(initialValue);
  const [currentSelection, setCurrentSelection] = React.useState(
    initialValueSelection,
  );
  let refobj: any = null;
  const s = useStyles();
  const ref = useRef(refobj);
  const editor = useSlate();

  useEffect(() => {
    const el: any = ref.current;
    const { selection } = editor;
    if (!el) {
      return;
    }
    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }
    const domSelection: any = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <>
      <div ref={ref} className={s.root}>
        <ButtonGroup variant="text">
          <IconButton
            onClick={() => {
              props.handleClickIcon("bold");
            }}
            className={s.button}
            size="small"
          >
            <FormatBold
              className={
                isFormatActive("bold", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIcon("italic");
            }}
            className={s.button}
            size="small"
          >
            <FormatItalic
              className={
                isFormatActive("italic", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIcon("underline");
            }}
            className={s.button}
            size="small"
          >
            <FormatUnderlined
              className={
                isFormatActive("underline", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIcon("code");
            }}
            className={s.button}
            size="small"
          >
            <Code
              className={
                isFormatActive("code", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIconBlock("block-quote");
            }}
            className={s.button}
            size="small"
          >
            <FormatQuote
              className={
                isFormatActive("block-quote", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
        </ButtonGroup>
        <ButtonGroup>
          <IconButton
            onClick={() => {
              props.handleClickIconBlock("heading-one");
            }}
            className={s.button}
            size="small"
          >
            <Title
              className={
                isFormatActive("heading-one", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"default"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIconBlock("heading-two");
            }}
            className={s.button}
            size="small"
          >
            <Title
              className={
                isFormatActive("heading-two", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIconBlock("bulleted-list");
            }}
            className={s.button}
            size="small"
          >
            <FormatListBulleted
              className={
                isFormatActive("bulleted-list", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={() => {
              props.handleClickIconBlock("numbered-list");
            }}
            className={s.button}
            size="small"
          >
            <FormatListNumbered
              className={
                isFormatActive("numbered-list", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              if (isLinkActive(editor)) {
                unwrapLink(editor);
              } else {
                setCurrentSelection(editor.selection);
                setLink("");
              }
            }}
            className={s.button}
            size="small"
          >
            <Link
              className={
                isFormatActive("link", editor)
                  ? s.selectedIcon
                  : s.unselectedIcon
              }
              fontSize={"small"}
            />
          </IconButton>
        </ButtonGroup>
      </div>
      {link !== null && (
        <Input
          className={s.input}
          onBlur={(e) => {
            e.preventDefault()
            setLink(null);
          }}
          type="url"
          value={link}
          onChange={(x) => {
            x.preventDefault();
            setLink(x.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              editor.selection = currentSelection;
              if (link.length > 0) {
                props.onLinkInserted(link);
                setLink(null);
              }
            }
          }}
          endAdornment={
            <Close
              className={s.close}
              fontSize="small"
              onClick={(e) => {
                e.preventDefault();
                setLink(null);
              }}
            />
          }
          placeholder="https://"
          disableUnderline
          autoFocus
        />
      )}
    </>
  );
}
