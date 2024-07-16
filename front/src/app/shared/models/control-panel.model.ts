type ControlPanelConfigWithControls = {
  enabled: true;
  renderControls: {
    search: boolean;
    category: boolean;
    sort: boolean;
    view: boolean;
  };
};

type ControlPanelConfigWithoutControls = {
  enabled: false;
  renderControls?: never;
};

export type ControlPanelConfigType =
  | ControlPanelConfigWithControls
  | ControlPanelConfigWithoutControls;
