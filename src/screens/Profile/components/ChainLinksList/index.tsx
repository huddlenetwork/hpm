import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import ListItemSeparator from 'components/ListItemSeparator';
import { DPMImages } from 'types/images';
import useShowModal from 'hooks/useShowModal';
import SingleButtonModal from 'modals/SingleButtonModal';
import { ChainLink } from 'types/desmos';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import ChainLinkContentLoader from 'components/ContentLoaders/ChainLink';
import Spacer from 'components/Spacer';
import ChainLinkItem from '../ChainLinkItem';
import useStyles from './useStyles';
import useConnectChain from './useHooks';

export interface ChainConnectionsProps {
  canEdit: boolean;
  chainLinks: ChainLink[];
  loading?: boolean;
}

const ChainLinksList = (props: ChainConnectionsProps) => {
  const { t } = useTranslation('chainLinks');
  const { canEdit, chainLinks, loading } = props;
  const hasConnections = chainLinks.length !== 0;
  const styles = useStyles();

  const showModal = useShowModal();

  const onChainConnected = useCallback(() => {
    showModal(SingleButtonModal, {
      title: t('chain linked'),
      message: t('chain link created successfully'),
      actionLabel: t('ok'),
      image: DPMImages.Success,
    });
  }, [showModal, t]);

  const connectChain = useConnectChain(onChainConnected, chainLinks);

  const renderItem = (info: ListRenderItemInfo<ChainLink>) => {
    const { item } = info;
    return <ChainLinkItem chainLink={item} canEdit={canEdit} />;
  };

  const ListEmptyComponent = useCallback(() => {
    if (!canEdit) {
      return null;
    }

    return (
      <View style={styles.noConnectionsContainer}>
        {/* No connection icon */}
        <DpmImage
          style={styles.noConnectionImage}
          resizeMode="cover"
          source={DPMImages.NoConnection}
        />

        {/* Option to connect a chain */}
        <Typography.Body>{t('connect your chain account')}</Typography.Body>
        <Button style={styles.connectChainButton} onPress={connectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      </View>
    );
  }, [canEdit, connectChain, styles, t]);

  if (loading) {
    return (
      <>
        <TypographyContentLoaders.Body1 width={160} />
        <Spacer paddingTop={12} />
        <ChainLinkContentLoader />

        <Spacer paddingTop={12} />
        <ChainLinkContentLoader />

        <Spacer paddingTop={12} />
        <ChainLinkContentLoader />

        <Spacer paddingTop={12} />
        <ChainLinkContentLoader />
      </>
    );
  }

  return (
    <View style={styles.root}>
      {/* Chain links list */}

      <View style={styles.connectionsContainer}>
        {hasConnections && (
          <Typography.Body1 style={styles.connectionsListTitle}>
            {t('connected chains')}
          </Typography.Body1>
        )}
        <FlatList
          style={styles.connectionsList}
          data={chainLinks}
          renderItem={renderItem}
          keyExtractor={(item) => item.chainName + item.externalAddress}
          ItemSeparatorComponent={ListItemSeparator}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>

      {/* Connect button */}
      {canEdit && hasConnections && (
        <Button style={styles.connectChainButton} onPress={connectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      )}
    </View>
  );
};

export default ChainLinksList;
