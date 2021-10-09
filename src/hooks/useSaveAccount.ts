import {ChainAccount} from "../types/chain";
import AccountSource from "../sources/AccountSource";
import {useCallback} from "react";
import useSetAccounts from "./useSetAccounts";

/**
 * Hooks to save an account into the device storage.
 * Returns a function to save an account into the device storage.
 */
export default function useSaveAccount() {
    const setAccounts = useSetAccounts()

    return useCallback(async (account: ChainAccount, updateAppState?: boolean) => {
        await AccountSource.putAccount(account);
        if (updateAppState === true) {
            setAccounts((accounts) => {
                return [...accounts, account];
            });
        }
        return account;
    }, [setAccounts]);
}