import {StackScreenProps} from "@react-navigation/stack";
import {AirdropScreensStackParams} from "../../types/navigation";
import React, {useCallback} from "react";
import {Button, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {FlatList, Image, ListRenderItemInfo, View} from "react-native";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import useFetchAllottedDsm from "../../hooks/useFetchAllottedDsm";
import {Allocation, AllocationType} from "../../api/AirdropApi";


export type Props = StackScreenProps<AirdropScreensStackParams, "AirdropAllocation">;

export const AirdropAllocation: React.FC<Props> = ({navigation, route}) => {
    const {params} = route;
    const styles = useStyles();
    const {t} = useTranslation();
    const {loading, allocations, allottedCoins, error, allClaimed} = useFetchAllottedDsm(params.address)

    const claimNow = useCallback(() => {
        navigation.navigate({
            name: "AirdropClaimStatus",
            params: {
                address: params.address
            }
        })
    }, [navigation, params.address]);

    const renderAllocation = useCallback(({item}: ListRenderItemInfo<Allocation>) => {
        const {chainName, claimed, amount} = item;
        return <View style={styles.allocation}>
            <Image
                source={require("../../assets/tick_orange.png")}
                style={styles.allocationTick}
            />
            {item.type === AllocationType.Staking ? (
                <Typography.Body1 style={styles.allocationText}>
                    {chainName} Staker {item.forboleDelegator ? "& Forbole Delegator" : ""}
                </Typography.Body1>
            ) : (
                <Typography.Body1 style={styles.allocationText}>
                    {chainName} LP
                </Typography.Body1>
            )}
            <Typography.Body1 style={[styles.allocationAmount, claimed ? styles.allocationClaimed : null]}>
                {amount} DSM {claimed ? t("claimed") : ""}
            </Typography.Body1>

        </View>
    }, [styles.allocation, styles.allocationTick, styles.allocationText,
        styles.allocationAmount, styles.allocationClaimed, t])

    return <StyledSafeAreaView topBar={
        <TopBar stackProps={{navigation}} />
    }>
        <View style={styles.allocationContainer}>
            <Image
                style={styles.dsmToken}
                source={require("../../assets/dsm_token.png")}
                resizeMode="contain"
            />
            <Typography.Body1>
                {t("your allocation is")}
            </Typography.Body1>
            {error === null ? (
                <Typography.H1
                    ellipsizeMode="middle"
                    numberOfLines={1}
                >
                    {loading ? "..." : `${allottedCoins} DSM`}
                </Typography.H1>
            ) : (
                <Typography.Body>
                    {`${t("an error occurred")} ${error}`}
                </Typography.Body>
            )}
        </View>
        <View style={styles.allocationDetails}>
            <Typography.Body1
                style={styles.address}
                numberOfLines={1}
                ellipsizeMode="middle"
            >
                {params.address}
            </Typography.Body1>
            <FlatList
                style={styles.allocationList}
                data={allocations}
                renderItem={renderAllocation}
                keyExtractor={(_, index) => index.toString()}
            />
            {!loading && <Typography.Body1 style={styles.info}>
                * {t("The more accounts you connected, the more DSM that allow you to claim")}
            </Typography.Body1>}
        </View>
        {loading || allClaimed ? null : (
            <Button
                mode="contained"
                onPress={claimNow}
                disabled={loading || error !== null || allottedCoins === 0 || allClaimed}
            >
                {t("claim now")}
            </Button>
        )}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    allocationContainer: {
        flex: 2,
        alignItems: "center",
    },
    dsmToken: {
        height: "60%",
        width: "100%",
    },
    allocationDetails: {
        flex: 4,
    },
    address: {
        color: "#000000",
        backgroundColor: "rgba(255, 198, 157, 0.32)",
        paddingHorizontal: theme.spacing.s,
        borderRadius: 3,
    },
    allocationList: {
        marginTop: theme.spacing.m,
    },
    allocation: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    allocationTick: {
        width: 16,
        height: 16,
    },
    allocationText: {
        color: theme.colors.primary,
        marginLeft: theme.spacing.s,
    },
    allocationAmount: {
        marginLeft: 8,
    },
    allocationClaimed: {
        color: theme.colors.font["3"],
    },
    info: {
        color: theme.colors.font["2"],
        flex: 9,
    }
}))