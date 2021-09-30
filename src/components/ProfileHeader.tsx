import React, {ReactNode, useCallback, useMemo} from "react";
import {Image, Text, View} from "react-native";
import {IconButton} from "react-native-paper";
import Clipboard from "@react-native-community/clipboard";
import {makeStyle} from "../theming";
import {useTranslation} from "react-i18next";
import {Divider} from "./Divider";
import {AvatarImage} from "./AvatarImage";
import {CachedDesmosProfile} from "../types/chain";

export type Props = {
    accountAddress: string
    profile: CachedDesmosProfile | null,
    openProfileEdit?: () => void,
    topRightElement?: ReactNode | null
    topLeftElement?: ReactNode | null
    onEditProfilePicture?: () => void,
    onEditCoverPicture?: () => void,
}

export const ProfileHeader: React.FC<Props> = (props) => {

    const styles = useStyles();
    const {t} = useTranslation();
    const {profile, accountAddress} = props;

    const coverPicture = useMemo(() => {
        return profile?.cachedCoverPictureUri ? {
            uri: profile?.cachedCoverPictureUri
        } : require("../assets/default-profile-cover.png");
    }, [profile])

    const profilePicture = useMemo(() => {
        return profile?.cachedProfilePictureUri ? {
            uri: profile?.cachedProfilePictureUri
        } : require("../assets/desmos-icon-gray.png");
    }, [profile]);

    const onCopyPressed = useCallback(() => {
        Clipboard.setString(accountAddress);
    }, [accountAddress])

    return <View
        style={styles.root}
    >
        <View style={styles.topRight}>
            {props.topRightElement}
        </View>
        <View style={styles.topLeft}>
            {props.topLeftElement}
        </View>
        <View style={styles.coverPictureContainer}>
            <Image
                style={styles.coverPicture}
                resizeMode="cover"
                source={coverPicture}
            />
            {props.onEditCoverPicture && <IconButton
                icon="camera-outline"
                size={20}
                color="#fff"
                onPress={props.onEditCoverPicture}
                style={styles.editCoverPictureBtn}
            />}
        </View>
        <View style={styles.profilePictureContainer}>
            <AvatarImage
                size={100}
                source={profilePicture}
            />
            {props.onEditProfilePicture && <IconButton
                icon="camera-outline"
                size={20}
                color="#fff"
                onPress={props.onEditProfilePicture}
                style={styles.editProfilePictureBtn}
            />}
        </View>
        {profile?.nickname && <Text style={styles.nickName}>{profile.nickname}</Text>}
        {profile?.dtag && <Text style={styles.dtag}>@{profile.dtag}</Text>}
        <View style={styles.addressContainer}>
            <Text
                style={styles.address}
                lineBreakMode={"tail"}
            >
                {accountAddress}
            </Text>
            <View>
                <IconButton
                    icon="content-copy"
                    size={14}
                    onPress={onCopyPressed}
                />
                <Text>{t("copy")}</Text>
            </View>
        </View>
        <Divider style={styles.divider}/>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
    },
    topRight: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0
    },
    topLeft: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0
    },
    coverPictureContainer: {
        width: '100%',
    },
    coverPicture: {
        height: 200,
    },
    editCoverPictureBtn: {
        position: "absolute",
        bottom: 8,
        right: 8,
        backgroundColor: '#7a7a7a',
        padding: 2,
    },
    profilePictureContainer: {
        marginTop: -70,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editProfilePictureBtn: {
        position: "absolute",
        bottom: -10,
        right: -10,
        backgroundColor: '#7a7a7a',
        padding: 2,
    },
    nickName: {
        fontWeight: "500",
        fontSize: 22,
        lineHeight: 26,
        letterSpacing: 0.0015,
        color: theme.colors.primary,
        marginTop: 16,
    },
    dtag: {
        color: theme.colors.text,
        fontFamily: 'SF-Pro-Text',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 14,
        lineHeight: 17,
        marginTop: 6,
    },
    addressContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 16,
        marginHorizontal: 32,
        alignItems: "center"
    },
    address: {
        color: theme.colors.text,
        marginRight: 32,
    },
    divider: {
        width: 63,
        alignSelf: "flex-start",
        marginStart: 16,
        marginTop: 16,
    },
}))
