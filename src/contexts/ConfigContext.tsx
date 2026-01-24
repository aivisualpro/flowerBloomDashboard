'use client';

import PropTypes from 'prop-types';
import { createContext, useReducer } from 'react';

// project imports
import * as actionType from '@/store/actions';
import { CONFIG } from '@/config/constant';

// types
type ConfigState = {
  collapseMenu: boolean;
  collapseHeaderMenu?: boolean;
  collapseLayout?: boolean;
  collapseTabMenu?: boolean;
  headerBackColor?: string;
  isOpen: string[];
  isTrigger: string[];
};

type Action = {
  type: string;
  menu?: any;
};

type ConfigContextType = {
  state: ConfigState;
  dispatch: React.Dispatch<Action>;
};

const initialState: ConfigState = {
  ...CONFIG,
  isOpen: [], // for active default menu
  isTrigger: [], // for active default menu, set blank for horizontal
  collapseLayout: false,
  collapseHeaderMenu: false,
  collapseTabMenu: false,
  headerBackColor: ''
};

const ConfigContext = createContext<ConfigContextType>({
  state: initialState,
  dispatch: () => null
});
const { Provider } = ConfigContext;

function ConfigProvider({ children }: { children: React.ReactNode }) {
  let trigger: string[] = [];
  let open: string[] = [];

  const [state, dispatch] = useReducer((stateData: ConfigState, action: Action) => {
    switch (action.type) {
      case actionType.COLLAPSE_MENU:
        return {
          ...stateData,
          collapseMenu: !stateData.collapseMenu
        };
      case actionType.COLLAPSE_HEADERMENU:
        return {
          ...stateData,
          collapseHeaderMenu: !stateData.collapseHeaderMenu
        };

      case actionType.COLLAPSE_TOGGLE:
        if (action.menu.type === 'sub') {
          open = stateData.isOpen;
          trigger = stateData.isTrigger;

          const triggerIndex = trigger.indexOf(action.menu.id);
          if (triggerIndex > -1) {
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          }

          if (triggerIndex === -1) {
            open = [...open, action.menu.id];
            trigger = [...trigger, action.menu.id];
            trigger = [...trigger, action.menu.id];
          }
        } else {
          open = stateData.isOpen;
          const triggerIndex = stateData.isTrigger.indexOf(action.menu.id);
          trigger = triggerIndex === -1 ? [action.menu.id] : [];
          open = triggerIndex === -1 ? [action.menu.id] : [];
        }

        return {
          ...stateData,
          isOpen: open,
          isTrigger: trigger
        };
      default:
        throw new Error();
    }
  }, initialState);
  return (
    <Provider value={{ state, dispatch }}>
      <>{children}</>{' '}
    </Provider>
  );
}

export { ConfigContext, ConfigProvider };

ConfigProvider.propTypes = { children: PropTypes.any };
