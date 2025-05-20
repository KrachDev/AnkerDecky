import {
  PanelSection,
  PanelSectionRow,
  ButtonItem,
  Navigation,
  definePlugin,
  staticClasses,
} from "@decky/ui";
import { routerHook } from "@decky/api"; // import routerHook for routing
import { FaStore } from "react-icons/fa";
import { StoreUI } from "./StoreUI";

const Content = () => {
  const openStore = () => {
    Navigation.Navigate("/anker-store");
    Navigation.CloseSideMenus();
  };

  return (
      <PanelSection title="AnkerDecky Store">
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={openStore} icon={<FaStore />}>
            Open Store
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
  );
};

export default definePlugin(() => {
  // Register the route for your store UI
  routerHook.addRoute("/anker-store", StoreUI);

  return {
    name: "AnkerDecky",
    titleView: <div className={staticClasses.Title}>AnkerDecky Store</div>,
    content: <Content />,
    icon: <FaStore />,
    onDismount() {
      routerHook.removeRoute("/anker-store"); // clean up route when plugin unloads
    },
  };
});
