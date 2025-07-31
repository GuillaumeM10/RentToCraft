"use client";
import React, { Fragment, useRef } from "react";
import SiteLogo from "./Icons/SiteLogo";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

interface OffCanvasProps {
  children: React.ReactNode;
  buttonContent: React.ReactNode | string;
  buttonClassName?: string;
  autoCloseOnClick?: boolean;
}

const OffCanvas = ({
  children,
  buttonContent,
  buttonClassName,
  autoCloseOnClick = false,
}: OffCanvasProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const canReceiveCustomProps = (elementType: any): boolean => {
    if (typeof elementType === "string") {
      return false;
    }

    if (elementType === React.Fragment) {
      return false;
    }

    return typeof elementType === "function";
  };

  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const props: any = {};

        if (child.type === React.Fragment) {
          const fragmentProps = child.props as { children?: React.ReactNode };
          if (fragmentProps.children) {
            return React.cloneElement(
              child,
              { key: child.key },
              processChildren(fragmentProps.children),
            );
          }
          return child;
        }

        const childProps = child.props as Record<string, any>;

        if (autoCloseOnClick) {
          if (
            child.type === "a" ||
            (childProps &&
              typeof childProps === "object" &&
              "href" in childProps)
          ) {
            const originalOnClick = childProps.onClick;
            props.onClick = (event: React.MouseEvent) => {
              if (originalOnClick) {
                originalOnClick(event);
              }
              handleClose();
            };
          } else if (child.type === "button") {
            const originalOnClick = childProps.onClick;
            props.onClick = (event: React.MouseEvent) => {
              if (originalOnClick) {
                originalOnClick(event);
              }
              handleClose();
            };
          }
        }

        if (canReceiveCustomProps(child.type)) {
          props.closeCanvas = handleClose;
        }

        if (
          childProps &&
          typeof childProps === "object" &&
          "children" in childProps
        ) {
          props.children = processChildren(
            childProps.children as React.ReactNode,
          );
        }

        return React.cloneElement(child, props);
      }
      return child;
    });
  };

  return (
    <Fragment>
      <dialog className="off-canvas dialog-menu" ref={dialogRef}>
        <div className="heading flex justify-between align-items-center">
          <SiteLogo className="icon-site-logo" />

          <button
            type="button"
            className="close"
            onClick={() => dialogRef.current?.close()}
          >
            <X />
          </button>
        </div>
        {processChildren(children)}
      </dialog>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className={`dialog-open ${buttonClassName || ""}`}
      >
        {buttonContent}
      </button>
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(OffCanvas), {
  ssr: false,
});
