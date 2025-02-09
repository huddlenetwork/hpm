import React, { useCallback } from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ModalComponentProps } from 'modals/ModalScreen';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import ListItemSeparator from 'components/ListItemSeparator';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import LoginProviderListItem from 'modals/Web3AuthLoginProvidersModal/components/LoginProviderListItem';
import useStyles from './useStyles';

export type Web3AuthLoginProviderParams = {
  onSelect: (loginProvider: Web3AuthLoginProvider) => any;
};

const Web3AuthLoginProvidersModal: React.FC<ModalComponentProps<Web3AuthLoginProviderParams>> = (
  props,
) => {
  const { params, closeModal } = props;
  const { onSelect } = params;
  const styles = useStyles();
  const { t } = useTranslation('web3auth');

  const renderItem = useCallback(
    (info: ListRenderItemInfo<Web3AuthLoginProvider>) => {
      const { item } = info;
      return (
        <LoginProviderListItem
          loginProvider={item}
          onPress={() => {
            onSelect(item);
            closeModal();
          }}
        />
      );
    },
    [onSelect, closeModal],
  );

  return (
    <View style={styles.root}>
      <Typography.Title style={styles.title}>{t('select login provider')}</Typography.Title>

      <Spacer paddingVertical={8} />

      <View style={styles.list}>
        <FlashList
          data={Object.values(Web3AuthLoginProvider)}
          renderItem={renderItem}
          estimatedItemSize={40}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </View>

      <Spacer paddingVertical={8} />

      <Button onPress={closeModal}>{t('common:cancel')}</Button>
    </View>
  );
};

export default Web3AuthLoginProvidersModal;
