import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { LedgerApp } from 'types/ledger';
import Typography from 'components/Typography';
import BlockchainListItem from 'components/BlockchainListItem';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ListItemSeparator from 'components/ListItemSeparator';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useRecoilState } from 'recoil';
import { CosmosLedgerApp, CryptoOrgLedgerApp, DesmosLedgerApp } from 'config/LedgerApps';
import { CryptoDotOrgChain, DesmosChain } from 'config/LinkableChains';
import useConnectToLedger from 'hooks/useConnectToLedger';
import useSelectAccount from 'hooks/useSelectAccount';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import importAccountAppState from '@recoil/importAccountState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP>;

const ImportAccountSelectLedgerApp: React.FC<NavProps> = ({ navigation }) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const [importAccountState] = useRecoilState(importAccountAppState);
  const { ignoreAddresses, selectedChain, onSuccess } = importAccountState!;
  const connectToLedger = useConnectToLedger();
  const selectAccount = useSelectAccount();

  const ledgerApplications = useMemo(() => {
    if (selectedChain!.name === CryptoDotOrgChain.name) {
      return [CryptoOrgLedgerApp, CosmosLedgerApp];
    }
    if (selectedChain!.name === DesmosChain.name) {
      return [DesmosLedgerApp, CosmosLedgerApp];
    }
    return [CosmosLedgerApp];
  }, [selectedChain]);

  const onLedgerAppSelected = useCallback(
    async (ledgerApp: LedgerApp) => {
      const transport = await connectToLedger(ledgerApp);
      if (transport === undefined) {
        return;
      }

      selectAccount(
        {
          mode: WalletPickerMode.Ledger,
          ignoreAddresses,
          ledgerApp,
          transport,
          addressPrefix: selectedChain!.prefix,
          masterHdPath: ledgerApp.masterHdPath,
        },
        {
          onSuccess: (account) => {
            onSuccess({ account, chain: selectedChain! });
          },
        },
      );
    },
    [connectToLedger, selectAccount, ignoreAddresses, selectedChain, onSuccess],
  );

  const renderLedgerApp = useCallback(
    ({ item }: ListRenderItemInfo<LedgerApp>) => (
      <BlockchainListItem
        name={item.uiName}
        icon={item.icon}
        onPress={() => onLedgerAppSelected(item)}
      />
    ),
    [onLedgerAppSelected],
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('select app')} />
      }
    >
      <Typography.Body>{t('select app to use')}</Typography.Body>

      <FlatList
        style={styles.appList}
        data={ledgerApplications}
        renderItem={renderLedgerApp}
        ItemSeparatorComponent={ListItemSeparator}
        keyExtractor={(item, index) => index.toString()}
      />
    </StyledSafeAreaView>
  );
};

export default ImportAccountSelectLedgerApp;
