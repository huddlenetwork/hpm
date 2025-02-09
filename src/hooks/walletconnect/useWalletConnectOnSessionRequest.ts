import SignClient from '@walletconnect/sign-client';
import { useStoredAccounts } from '@recoil/accounts';
import { useGetSessionByTopic } from '@recoil/walletConnectSessions';
import { useStoreWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { decodeSessionRequest, getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import {
  CosmosRPCMethods,
  encodeGetAccountsRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';
import ROUTES from 'navigation/routes';

const useWalletConnectOnSessionRequest = (signClient: SignClient | undefined) => {
  const accounts = useStoredAccounts();
  const getSessionByTopic = useGetSessionByTopic();
  const storeSessionRequest = useStoreWalletConnectSessionRequest();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return useCallback(
    (args: SignClientTypes.EventArguments['session_request'], showRequest?: boolean) => {
      if (signClient === undefined) {
        return;
      }

      // Find the session from the app state sessions.
      const session = getSessionByTopic(args.topic);
      if (session === undefined) {
        // @ts-ignore
        signClient.pendingRequest.delete(args.topic, getSdkError('USER_DISCONNECTED'));
        return;
      }

      const account = accounts[session.accountAddress];
      const supportedMethods = getAccountSupportedMethods(account);
      if (supportedMethods.indexOf(args.params.request.method) === -1) {
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: getSdkError('INVALID_METHOD'),
          },
        });
        return;
      }

      const decodeResult = decodeSessionRequest(args, session.accountAddress);
      if (decodeResult.isError()) {
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: {
              message: decodeResult.error,
              code: 1,
            },
          },
        });
        return;
      }

      const decodedRequest = decodeResult.value;
      switch (decodedRequest.method) {
        case CosmosRPCMethods.GetAccounts:
          signClient.respond({
            topic: decodedRequest.topic,
            response: {
              id: decodedRequest.id,
              jsonrpc: '2.0',
              result: encodeGetAccountsRpcResponse([
                {
                  address: account.address,
                  algo: account.algo,
                  pubkey: account.pubKey,
                },
              ]),
            },
          });
          break;
        case CosmosRPCMethods.SignAmino:
        case CosmosRPCMethods.SignDirect:
          storeSessionRequest(decodedRequest);
          if (showRequest !== false) {
            navigation.navigate(ROUTES.WALLET_CONNECT_REQUEST);
          }
          break;
        default:
          signClient.respond({
            topic: args.topic,
            response: {
              id: args.id,
              jsonrpc: '2.0',
              error: getSdkError('INVALID_METHOD'),
            },
          });
          break;
      }
    },
    [accounts, getSessionByTopic, navigation, signClient, storeSessionRequest],
  );
};

export default useWalletConnectOnSessionRequest;
