import { NativeModules } from 'react-native';

export const { CryptoUtils } = NativeModules;

export interface CryptoUtilsKeyPair {
  /**
   * Hex encoded private key.
   */
  readonly privkey: string;
  /**
   * Hex encoded uncompressed public key.
   */
  readonly pubkey: string;
}

export interface NativeCryptoUtils {
  deriveKeyPairFromMnemonic(
    mnemonic: String,
    coinType: number,
    account: number,
    change: number,
    index: number,
  ): Promise<CryptoUtilsKeyPair>;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    CryptoUtils: NativeCryptoUtils;
  }
}
