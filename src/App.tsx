import React, {useEffect, useRef} from 'react';
import {RecoilRoot, useRecoilValue} from 'recoil';
import useLoadAccounts from './hooks/useLoadAccounts';
import {Provider as PaperProvider} from "react-native-paper";
import {AppTheme} from "./theming";
import {useInitI18n} from "./i18n/i18n";
import {SplashScreen} from "./screens/SplashScreen";
import {DesmosSdkProvider} from "@desmoslabs/sdk-react";
import AccountStore from "./store/AccountStore";
import {NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {AccountScreensStackParams, RootStack} from "./types/navigation";
import WalletConnectStore from "./store/WalletConnectStore";
import AccountCreationScreens from "./navigation/AccountCreationScreens";
import AccountScreens from "./navigation/AccountScreens";

function AppContent(): JSX.Element {
    const accountLoadStatus = useLoadAccounts();
    const i18nState = useInitI18n();
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const navigatorRef = useRef<NavigationContainerRef<AccountScreensStackParams>>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);
    const selectedAccount = useRecoilValue(AccountStore.selectedAccount);

    const loading = accountLoadStatus.isPending() || i18nState.isPending();

    useEffect(() => {
        if (navigatorRef.current !== null && requests.length > 0) {
            navigatorRef.current.navigate({
                name: "WalletConnectRequest",
                params: {
                    session: requests[0].session,
                    request: requests[0].request,
                },
                key: requests[0].request.request.id.toString()
            });
        }
    }, [requests]);

    // Navigate to the correct screen after loading all the data.
    useEffect(() => {
        if (!loading && navigatorRef.current !== null) {
            if (accounts.length === 0 || selectedAccount === null) {
                // No account, go to the create account screens
                navigatorRef.current.reset({
                    index: 0,
                    routes: [{name: "AccountCreationScreens"}],
                })
            }
            else {
                // Go to the account screen
                navigatorRef.current.reset({
                    index: 0,
                    routes: [{
                        name: "AccountScreens",
                        params: {
                            account: selectedAccount
                        }
                    }],
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, navigatorRef])

    return <NavigationContainer ref={navigatorRef}>
        <RootStack.Navigator
            initialRouteName="SplashScreen"
            screenOptions={{
                headerShown: false,
            }}
        >
            <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
            <RootStack.Screen name="AccountScreens" component={AccountScreens}/>
            <RootStack.Screen name="AccountCreationScreens" component={AccountCreationScreens}/>
        </RootStack.Navigator>
    </NavigationContainer>;
}

export default function App(): JSX.Element {
    const chainId = __DEV__ ? 'morpheus-apollo-2' : 'desmos-mainnet'
    return (
        <DesmosSdkProvider chainId={chainId}>
            <RecoilRoot>
                <PaperProvider theme={AppTheme}>
                    <AppContent />
                </PaperProvider>
            </RecoilRoot>
        </DesmosSdkProvider>
    );
}
