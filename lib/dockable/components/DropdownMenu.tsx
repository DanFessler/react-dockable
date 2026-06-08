import { DropdownMenu, ContextMenu } from "radix-ui";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";
import styles from "./DropdownMenu.module.css";
export type CustomItems = ItemSection[];

type ItemSection = {
  label?: string;
  items: Item[];
};

type Item =
  | {
      label: string;
      onClick: () => void;
      shortcut?: string;
      /** When true, the item is shown greyed-out and cannot be selected. */
      disabled?: boolean;
    }
  | ItemSection; // for submenus

type WindowContextMenuProps = {
  id: string;
  customItems?: CustomItems;
  children?: React.ReactNode;
  mode?: "dropdown" | "context";
};

function Menu({
  customItems,
  children,
  mode = "dropdown",
}: WindowContextMenuProps) {
  if (!children || !customItems) return null;

  const NameSpace = mode === "dropdown" ? DropdownMenu : ContextMenu;

  function renderMenuItem(
    item: { label: string; onClick: () => void; shortcut?: string; disabled?: boolean },
    key: number
  ) {
    return (
      <NameSpace.Item
        key={key}
        className={styles.Item}
        disabled={item.disabled}
        onSelect={item.onClick}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        {item.label}
        {item.shortcut && (
          <div className={styles.RightSlot}>{item.shortcut}</div>
        )}
      </NameSpace.Item>
    );
  }

  function renderCustomItems(items: CustomItems) {
    if (!items) return null;

    return items.map((section, index) => (
      <React.Fragment key={index}>
        {section.label && (
          <NameSpace.Label className={styles.Label}>
            {section.label}
          </NameSpace.Label>
        )}
        {section.items.map((item, itemIndex) => {
          if ("onClick" in item) {
            return renderMenuItem(item, itemIndex);
          } else {
            // Submenu - recursively render its items
            return (
              <NameSpace.Sub key={itemIndex}>
                <NameSpace.SubTrigger className={styles.SubTrigger}>
                  {item.label}
                  <div className={styles.RightSlot}>
                    <ChevronRightIcon />
                  </div>
                </NameSpace.SubTrigger>
                <NameSpace.SubContent className={styles.SubContent}>
                  {item.items.map((subItem, subItemIndex) => {
                    if ("onClick" in subItem) {
                      return renderMenuItem(subItem, subItemIndex);
                    } else {
                      // Recursively render nested submenus
                      return (
                        <NameSpace.Sub key={subItemIndex}>
                          <NameSpace.SubTrigger className={styles.SubTrigger}>
                            {subItem.label}
                          </NameSpace.SubTrigger>
                          <NameSpace.SubContent className={styles.SubContent}>
                            {renderCustomItems([{ items: subItem.items }])}
                          </NameSpace.SubContent>
                        </NameSpace.Sub>
                      );
                    }
                  })}
                </NameSpace.SubContent>
              </NameSpace.Sub>
            );
          }
        })}
        {index < items.length - 1 && (
          <NameSpace.Separator className={styles.Separator} />
        )}
      </React.Fragment>
    ));
  }

  function renderDefaultItems() {
    return;
    return (
      <>
        <NameSpace.Item className={styles.Item}>default item 1</NameSpace.Item>
        <NameSpace.Item className={styles.Item}>default item 2</NameSpace.Item>
        {customItems && <NameSpace.Separator className={styles.Separator} />}
      </>
    );
  }
  return (
    <NameSpace.Root>
      <NameSpace.Trigger asChild className={styles.Trigger}>
        {children}
      </NameSpace.Trigger>
      <NameSpace.Portal>
        <NameSpace.Content className={styles.Content}>
          {renderDefaultItems()}
          {customItems && renderCustomItems(customItems)}
        </NameSpace.Content>
      </NameSpace.Portal>
    </NameSpace.Root>
  );
}

export default Menu;
