import React, {useCallback, useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {
    AccountCreationStackParams,
    RootStackParams
} from "../../types/navigation";
import {ChainAccount, ChainAccountType} from "../../types/chain";
import useSaveWallet from "../../hooks/useSaveWallet";
import useSaveAccount from "../../hooks/useSaveAccount";
import {StyledSafeAreaView, Button, Title, Paragraph} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {Image} from "react-native";
import {CompositeScreenProps} from "@react-navigation/native";
import useChangeAccount from "../../hooks/useChangeAccount";
import useSaveSelectedAccount from "../../hooks/useSaveSelectedAccount";
import useSetAccounts from "../../hooks/useSetAccounts";


declare type Props = CompositeScreenProps<StackScreenProps<AccountCreationStackParams, "GenerateAccount">,
    StackScreenProps<RootStackParams, "AccountCreationScreens">>;

export default function GenerateAccount(props: Props): JSX.Element {

    const {navigation} = props;
    const {wallet, password} = props.route.params
    const {t} = useTranslation();
    const styles = useStyles();
    const [generating, setGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<ChainAccount | null>(null);
    const setAccounts = useSetAccounts();
    const saveWallet = useSaveWallet();
    const saveAccount = useSaveAccount();
    const saveSelectedAccount = useSaveSelectedAccount();
    const changeAccount = useChangeAccount();

    const generateAccount = useCallback(async () => {
        setGenerating(true);
        try {
            await saveWallet(wallet, password);
            const account: ChainAccount = {
                type: ChainAccountType.Local,
                name: wallet.bech32Address,
                address: wallet.bech32Address,
            }
            await saveAccount(account);
            await saveSelectedAccount(account);
            setAccount(account);
        } catch (e) {
            setError(e.toString());
        }
        setGenerating(false);
    }, [saveWallet, wallet, password, saveAccount, saveSelectedAccount]);

    const onContinuePressed = useCallback(() => {
        setAccounts((old) => [...old, account!]);
        changeAccount(account!);
    }, [account, setAccounts, changeAccount]);

    useEffect(() => {
        return navigation.addListener("beforeRemove", e => {
            if (e.data.action.type !== "RESET") {
                e.preventDefault();
            }
        })
    }, [navigation])

    useEffect(() => {
        generateAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return <StyledSafeAreaView style={styles.root}>
        {generating ? (
            <Title
                style={styles.generatingText}
            >
                {t("generating account")}...
            </Title>
        ) : account !== null ? (<>
            <Image
                style={styles.icon}
                source={require("../../assets/success.png")}
                resizeMode="center"
            />

            <Title>
                {t("success")}
            </Title>
            <Paragraph fontSize={16}>
                {t("account created")}
            </Paragraph>

            <Button
                style={styles.continueButton}
                mode="contained"
                onPress={onContinuePressed}
            >
                {t("continue")}
            </Button>
            {__DEV__ && <Button
                mode="contained"
                onPress={() => generateAccount()}
            >
                (DBG) Regenerate keys
            </Button>}
        </>) : (<>
            <Paragraph
                style={styles.errorText}
            >
                {t("error generating account")}
            </Paragraph>
            <Paragraph
                style={styles.errorText}
            >
                {error}
            </Paragraph>
        </>)}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    generatingText: {
    },
    icon: {
        height: 100,
    },
    continueButton: {
        alignSelf: "auto",
        marginTop: theme.spacing.s,
    },
    errorText: {
        color: theme.colors.error,
    }
}))