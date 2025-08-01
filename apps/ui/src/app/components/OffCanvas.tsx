"use client";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import React, { Fragment, useRef } from "react";

import SiteLogo from "./Icons/SiteLogo";

interface OffCanvasProps {
  readonly buttonContent: React.ReactNode | string;
  readonly children: React.ReactNode;
  readonly autoCloseOnClick?: boolean;
  readonly buttonClassName?: string;
  readonly dialogClassName?: string;
}

type ReactElementType =
  | React.ComponentType<Record<string, unknown>>
  | React.ExoticComponent
  | string;

interface ChildProps {
  children?: React.ReactNode;
  closeCanvas?: () => void;
  href?: string;
  onClick?: (event: React.MouseEvent) => void;
}

const OffCanvas = ({
  children,
  buttonContent,
  buttonClassName,
  dialogClassName,
  autoCloseOnClick = false,
}: OffCanvasProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const canReceiveCustomProps = (elementType: ReactElementType): boolean => {
    return typeof elementType === "function" && elementType !== React.Fragment;
  };

  const handleAutoCloseClick = (
    originalOnClick?: (event: React.MouseEvent) => void,
  ) => {
    return (event: React.MouseEvent) => {
      if (originalOnClick) {
        originalOnClick(event);
      }
      handleClose();
    };
  };

  const shouldAddClickHandler = (
    child: React.ReactElement,
    childProps: ChildProps,
  ): boolean => {
    return autoCloseOnClick && (child.type === "a" || "href" in childProps);
  };

  const processChildren = (childrenNodes: React.ReactNode): React.ReactNode => {
    return React.Children.map(childrenNodes, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      if (child.type === React.Fragment) {
        const fragmentProps = child.props as { children?: React.ReactNode };
        return fragmentProps.children
          ? React.cloneElement(
              child,
              { key: child.key },
              processChildren(fragmentProps.children),
            )
          : child;
      }

      const childProps = child.props as ChildProps;
      const newProps: ChildProps = {};

      if (shouldAddClickHandler(child, childProps)) {
        newProps.onClick = handleAutoCloseClick(childProps.onClick);
      }

      if (canReceiveCustomProps(child.type)) {
        newProps.closeCanvas = handleClose;
      }

      if (childProps.children) {
        newProps.children = processChildren(childProps.children);
      }

      return React.cloneElement(child, newProps);
    });
  };

  return (
    <Fragment>
      <dialog
        className={`off-canvas dialog-menu ${dialogClassName ?? ""}`}
        ref={dialogRef}
      >
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
        className={`dialog-open ${buttonClassName ?? ""}`}
      >
        {buttonContent}
      </button>
    </Fragment>
  );
};

export default dynamic(() => Promise.resolve(OffCanvas), {
  ssr: false,
});
