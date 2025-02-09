import Web3Auth, { OPENLOGIN_NETWORK, SdkLoginParams } from '@web3auth/react-native-sdk';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
// eslint-disable-next-line import/no-unresolved
import { WEB3_AUTH_CLIENT_ID_MAINNET, WEB3_AUTH_CLIENT_ID_TESTNET } from '@env';
import { Web3AuthLoginProvider } from 'types/web3auth';

// Remember to change this value also in android/app/src/main/AndroidManifest.xml.
export const Web3authScheme = 'dpmweb3auth';
export const Web3authResolveRedirectUrl = `${Web3authScheme}://openlogin`;

export const newWeb3AuthClient = () =>
  new Web3Auth(WebBrowser, {
    clientId: __DEV__ ? WEB3_AUTH_CLIENT_ID_TESTNET : WEB3_AUTH_CLIENT_ID_MAINNET,
    network: __DEV__ ? OPENLOGIN_NETWORK.TESTNET : OPENLOGIN_NETWORK.CYAN,
  });

export const web3AuthLoginParams = (
  loginProvider: Web3AuthLoginProvider,
): Omit<SdkLoginParams, 'curve'> => ({
  loginProvider,
  redirectUrl: Web3authResolveRedirectUrl,
});
