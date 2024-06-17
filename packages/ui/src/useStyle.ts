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

function createClassFromCssString(styles: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const styleElement = document.getElementById(
    "novu-css-in-js-appearance-styles"
  ) as HTMLStyleElement;

  if (!styleElement) {
    return "";
  }

  const index = styleElement.sheet?.cssRules.length ?? 0;
  const className = `nv-css-${index}`;
  const rule = `.${className} { ${styles} }`;

  styleElement.sheet?.insertRule(rule, index);

  return className;
}

export const useStyle = () => {
  const appearance = useAppearance();
  console.log("useStyle running", appearance);

  return (className: string, descriptor?: keyof Elements) => {
    const appearanceClassname =
      descriptor && typeof appearance.elements[descriptor] === "string"
        ? (appearance.elements[descriptor] as string) || ""
        : "";
    const appearanceCssInJs =
      descriptor && typeof appearance.elements[descriptor] === "object"
        ? (appearance.elements[descriptor] as CSSProperties) || {}
        : {};

    const cssInJsClassname = createClassFromCssString(
      cssObjectToString(appearanceCssInJs)
    );

    console.log("style() running", cssInJsClassname);

    return cn(
      `nv-${descriptor}`, // this is the targetable classname for customers
      className, // default styles
      appearanceClassname, // overrides via appearance prop classes
      cssInJsClassname // overrides via appearance prop css in js
    );
  };
};
