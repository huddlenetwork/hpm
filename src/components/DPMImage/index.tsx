import React, { useMemo } from 'react';
import useIsCurrentThemeDark from 'hooks/useIsCurrentThemeDark';
import { DPMImages } from 'types/images';
import {
  connectChainDarkIcon,
  connectChainLightIcon,
  connectLedgerDarkIcon,
  connectLedgerLightIcon,
  connectMnemonicDarkIcon,
  connectMnemonicLightIcon,
  desmosIconWhite,
  ledgerIcon,
  noConnectionDarkIcon,
  noConnectionLightIcon,
  noProfileDarkIcon,
  noProfileLightIcon,
  noTransactionDarkIcon,
  noTransactionLightIcon,
  resultFailDarkIcon,
  resultFailLightIcon,
  resultPasswordSuccess,
  resultSuccessDarkIcon,
  resultSuccessLightIcon,
} from 'assets/images';
import FastImage from 'react-native-fast-image';

type ImageProps = React.ComponentProps<typeof FastImage>;

export type DPMImageProps = Omit<ImageProps, 'source'> & {
  source: DPMImages | ImageProps['source'];
};

const DpmImage = (props: DPMImageProps) => {
  const { source } = props;
  const darkTheme = useIsCurrentThemeDark();

  const imageSource = useMemo(() => {
    const typeOfSource = typeof source;
    if (typeOfSource === 'number') {
      switch (source as DPMImages) {
        case DPMImages.NoTransaction:
          return darkTheme ? noTransactionDarkIcon : noTransactionLightIcon;
        case DPMImages.NoProfile:
          return darkTheme ? noProfileDarkIcon : noProfileLightIcon;
        case DPMImages.Success:
          return darkTheme ? resultSuccessDarkIcon : resultSuccessLightIcon;
        case DPMImages.PasswordSuccess:
          return resultPasswordSuccess;
        case DPMImages.Fail:
          return darkTheme ? resultFailDarkIcon : resultFailLightIcon;
        case DPMImages.NoConnection:
          return darkTheme ? noConnectionDarkIcon : noConnectionLightIcon;
        case DPMImages.ConnectChain:
          return darkTheme ? connectChainDarkIcon : connectChainLightIcon;
        case DPMImages.ConnectMnemonic:
          return darkTheme ? connectMnemonicDarkIcon : connectMnemonicLightIcon;
        case DPMImages.ConnectLedger:
          return darkTheme ? connectLedgerDarkIcon : connectLedgerLightIcon;
        case DPMImages.Ledger:
          return ledgerIcon;
        default:
          return desmosIconWhite;
      }
    } else {
      return source;
    }
  }, [source, darkTheme]);

  return <FastImage {...props} source={imageSource} />;
};

export default DpmImage;
