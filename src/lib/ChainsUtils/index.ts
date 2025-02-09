import { SupportedChain } from 'types/chains';
import SupportedChains from 'config/LinkableChains';
import { WalletType } from 'types/wallet';
import { AccountWithWallet } from 'types/account';
import { bech32AddressToAny } from '@desmoslabs/desmjs/build/aminomessages/profiles';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';

export const findChainInfoByName = (chainName: string) =>
  SupportedChains.flatMap((chain) => chain.chainInfo).find((info) => info?.chainName === chainName);

/**
 * Finds the details regarding a linkable chain from its chain name.
 */
export const getLinkableChainInfoByName = (chainName: string): SupportedChain | undefined => {
  const lowerCase = chainName.toLowerCase();
  return SupportedChains.find((linkableChain) => {
    const { name } = linkableChain.chainConfig;
    // Special case to handle both crypto.org and crypto.com
    if (name === 'crypto.org') {
      return lowerCase.indexOf('crypto.org') >= 0 || lowerCase.indexOf('crypto.com') >= 0;
    }
    return lowerCase.indexOf(name) >= 0;
  });
};

/**
 * Gets the address data to be used when linking an exteranl chain, based on the given
 * {@param chain} and {@param account} data.
 */
export const getAddress = (chain: SupportedChain, account: AccountWithWallet) =>
  bech32AddressToAny(
    Bech32Address.fromPartial({
      value: account.account.address,
      prefix: chain.prefix,
    }),
  );

/**
 * Return the supported types of wallet that can be created for a chain.
 * @param chain - The chain of interest.
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export const getChainSupportedWalletTypes = (chain: SupportedChain): WalletType[] =>
  // Return all since at the moment all the chains support those methods.
  [WalletType.Mnemonic, WalletType.Ledger];
