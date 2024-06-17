import { createEffect, createSignal } from "solid-js";
import { CSSProperties, Elements, useAppearance } from "./appearance-context";
import { cn } from "./lib/utils/cn";

function cssObjectToString(styles: CSSProperties): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join(" ");
}

function css(styleElement: HTMLStyleElement, styles: string) {
  const index = styleElement.sheet?.cssRules.length ?? 0;
  const className = `nv-css-${index}`;
  const rule = `.${className} { ${styles} }`;

  styleElement.sheet?.insertRule(rule, index);

  return className;
}

export const useStyle = () => {
  const [appearance, setAppearance] = createSignal(useAppearance());

  createEffect(() => {
    console.log("useStyle running", appearance());
  });

  return (className: string, descriptor?: keyof Elements | undefined) => {
    const descriptorKey = descriptor as keyof Elements;
    const appearanceData = appearance();
    const appearanceClassname =
      descriptor && typeof appearanceData.elements[descriptorKey] === "string"
        ? (appearanceData.elements[descriptor] as string) || ""
        : "";

    const appearanceCssInJs =
      descriptor && typeof appearanceData.elements[descriptor] === "object"
        ? (appearanceData.elements[descriptor] as CSSProperties) || {}
        : {};

    let cssInJsClassname = "";

    if (appearanceData.styleElement) {
      cssInJsClassname = css(
        appearanceData.styleElement,
        cssObjectToString(appearanceCssInJs)
      );
    }

    console.log("style() running", cssInJsClassname);

    return cn(
      `nv-${descriptor}`, // this is the targetable classname for customers
      className, // default styles
      appearanceClassname, // overrides via appearance prop classes
      cssInJsClassname // overrides via appearance prop css in js
    );
  };
};
