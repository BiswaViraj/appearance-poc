import {
  ParentProps,
  createContext,
  useContext,
  createSignal,
  createMemo,
} from "solid-js";

export type CSSProperties = {
  [key: string]: string | number;
};

export type ElementStyles = string | CSSProperties;

export type Elements = {
  button?: ElementStyles;
  root?: ElementStyles;
};

export type AppearanceContextType = {
  elements: Elements;
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

type AppearanceProviderProps = ParentProps & {
  elements?: Elements;
};

export const AppearanceProvider = (props: AppearanceProviderProps) => {
  const [elements, setElements] = createSignal(props.elements || {});

  let styleElement: HTMLStyleElement | null = null;
  if (typeof window !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.id = "novu-css-in-js-appearance-styles";

    document.head.appendChild(styleElement);
  }

  return (
    <AppearanceContext.Provider value={{ elements: elements() }}>
      {props.children}
    </AppearanceContext.Provider>
  );
};

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }

  // Using a reactive memo to ensure elements update reactively
  const elements = createMemo(() => context.elements);

  return { ...context, elements };
}
