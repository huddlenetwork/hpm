import React from 'react';
import {AccountCreationStack} from "../types/navigation";
import AccountCreation from "../screens/AccountCreation/AccountCreation";
import GenerateNewMnemonic from "../screens/AccountCreation/GenerateNewMnemonic";
import CheckMnemonic from "../screens/AccountCreation/CheckMnemonic";
import ImportAccount from "../screens/AccountCreation/ImportAccount";
import GenerateAccountKeys from "../screens/AccountCreation/GenerateAccountKeys";
import CreateWalletPassword from "../screens/AccountCreation/CreateWalletPassword";
import {useTranslation} from "react-i18next";
import {NavigationBar} from "../components";

export default function AccountCreationNavigator() {
    const {t} = useTranslation();

    return <AccountCreationStack.Navigator
        initialRouteName={"AccountCreation"}
        screenOptions={{
            header: NavigationBar
        }}
    >
        <AccountCreationStack.Screen
            name="AccountCreation"
            component={AccountCreation}
            options={{
                headerShown: false,
            }}
        />
        <AccountCreationStack.Screen
            name="GenerateNewMnemonic"
            options={{
                title: t("create account"),
            }}
            component={GenerateNewMnemonic}
        />
        <AccountCreationStack.Screen
            name="CheckMnemonic"
            options={{
                title: t("check recovery passphrase"),
            }}
            component={CheckMnemonic}
        />
        <AccountCreationStack.Screen
            name={"ImportAccount"}
            options={{
                title: t("import account"),
            }}
            component={ImportAccount}
        />
        <AccountCreationStack.Screen
            name="CreateWalletPassword"
            options={{
                title: t("create wallet password"),
            }}
            component={CreateWalletPassword}
        />
        <AccountCreationStack.Screen
            name={"GenerateAccountKeys"}
            options={{
                headerShown: false
            }}
            component={GenerateAccountKeys}
        />
    </AccountCreationStack.Navigator>
}