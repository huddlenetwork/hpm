import { DesmosProfile } from '@desmoslabs/sdk-core';
import React, { useMemo, useState } from 'react';
import { ChainAccount } from '../types/chain';
import { ChainLink } from '../types/link';
import { AppSettings, DefaultAppSettings } from '../types/settings';

export type InitState = {
  initializing: boolean;
  errorMessage?: string;
};

export interface AppState {
  initializing: InitState;
  setInitializing: React.Dispatch<React.SetStateAction<InitState>>;

  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  accounts: ChainAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<ChainAccount[]>>;
  profiles: Record<string, DesmosProfile>;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, DesmosProfile>>>;
  chainLinks: Record<string, ChainLink[]>;
  setChainLinks: React.Dispatch<React.SetStateAction<Record<string, ChainLink[]>>>;
  selectedAccount: ChainAccount | null;
  setSelectedAccount: React.Dispatch<React.SetStateAction<ChainAccount | null>>;
}

// @ts-ignore
const AppContext = React.createContext<AppState>({});

export const AppStateProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState<InitState>({
    initializing: true,
  });
  const [accounts, setAccounts] = useState<ChainAccount[]>([]);
  const [profiles, setProfiles] = useState<Record<string, DesmosProfile>>({});
  const [chainLinks, setChainLinks] = useState<Record<string, ChainLink[]>>({});
  const [selectedAccount, setSelectedAccount] = useState<ChainAccount | null>(null);
  const [settings, setSettings] = useState(DefaultAppSettings);

  const contextProviderValue = useMemo(
    () => ({
      initializing,
      setInitializing,
      accounts,
      setAccounts,
      profiles,
      setProfiles,
      chainLinks,
      setChainLinks,
      selectedAccount,
      setSelectedAccount,
      settings,
      setSettings,
    }),
    [initializing, accounts, profiles, chainLinks, selectedAccount, settings]
  );

  return <AppContext.Provider value={contextProviderValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppState => React.useContext(AppContext);
