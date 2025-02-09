import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from 'components/Messages/MsgWithdrawDelegatorRewards/MsgWithdrawDelegatorRewardsListItem/useStyles';
import { msgWithdrawIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';

export type MsgWithdrawDelegatorRewardsListItemProps = {
  message: MsgWithdrawDelegatorRewardEncodeObject;
  date: Date;
};

/**
 * Displays the short details of a MsgWithdrawDelegatorRewards within a list.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsListItem = (props: MsgWithdrawDelegatorRewardsListItemProps) => {
  const { t } = useTranslation('messages.staking');
  const styles = useStyles();
  const { message, date } = props;
  const { value } = message;

  return (
    <BaseMessageListItem
      icon={msgWithdrawIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('withdraw rewards')}</Typography.Body1>
          <View style={styles.validatorAddress}>
            <Typography.Caption>
              {t('transaction:from')} {value.validatorAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgWithdrawDelegatorRewardsListItem;
