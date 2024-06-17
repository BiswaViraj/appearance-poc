import { createSignal, onMount } from "solid-js";
import {
  AppearanceContextType,
  AppearanceProvider,
} from "./appearance-context";
import { useStyle } from "./useStyle";

type InboxProps = {
  appearance?: Pick<AppearanceContextType, "elements">;
};

export const Inbox = (props: InboxProps) => {
  return (
    <AppearanceProvider elements={props.appearance?.elements}>
      <InternalInbox />
    </AppearanceProvider>
  );
};

const InternalInbox = () => {
  const style = useStyle();

  return (
    <div class="novu">
      <button class={style("tw-bg-blue-500", "button")}>test</button>
    </div>
  );
};
