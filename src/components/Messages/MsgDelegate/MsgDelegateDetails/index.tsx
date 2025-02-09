import { convertCoin } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import { msgDelegateIcon } from 'assets/images';
import BaseMessageDetails from '../../BaseMessage/BaseMessageDetails';

export type MsgDelegateDetailsProps = {
  message: MsgDelegateEncodeObject;
};

/**
 * Displays the full details of a MsgDelegate
 * @constructor
 */
const MsgDelegateDetails = (props: MsgDelegateDetailsProps) => {
  const { t } = useTranslation('messages.staking');
  const chainInfo = useCurrentChainInfo();
  const { message } = props;
  const { value } = message;

  const amount = useMemo(() => {
    const totalAmount = value.amount;
    if (totalAmount !== undefined) {
      const converted = convertCoin(totalAmount, 6, chainInfo.currencies);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return '';
    }
    return '';
  }, [value.amount, chainInfo.currencies]);

  return (
    <BaseMessageDetails
      icon={msgDelegateIcon}
      iconSubtitle={`${t('delegate')} ${amount}`}
      fields={[
        {
          label: t('sendTokens:amount'),
          value: amount,
        },
        {
          label: t('transaction:from'),
          value: value.delegatorAddress ?? '',
        },
        {
          label: t('transaction:to'),
          value: value.validatorAddress ?? '',
        },
      ]}
    />
  );
};

export default MsgDelegateDetails;
