import React, {ReactElement} from "react";
import {SafeAreaView, ScrollView, TouchableWithoutFeedback, View, ViewProps} from "react-native";
import {makeStyleWithProps} from "../theming";
import {Divider} from "./Divider";
import useCloseKeyboard from "../hooks/useCloseKeyboard";

export type Props = ViewProps & {
    /**
     * True if the content should be wrapped inside a ScrollView.
     */
    scrollable?: boolean,
    /**
     * View padding.
     */
    padding?: number,
    /**
     * Shows an element as a top bar.
     */
    topBar?: ReactElement,
    /**
     * If true adds a divider between the
     * top bar and the content.
     */
    divider?: boolean,
};

export const StyledSafeAreaView: React.FC<Props> = (props) => {
    const styles = useStyles(props);
    const closeKeyboard = useCloseKeyboard();

    return <SafeAreaView style={styles.background}>
        {props.topBar}
        {props.divider && <Divider />}
        <TouchableWithoutFeedback onPress={closeKeyboard}>
            <View style={[styles.content, props.style]}>
                {props?.scrollable ? (
                    <ScrollView>
                        {props.children}
                    </ScrollView>
                ) : props.children }
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
}

const useStyles = makeStyleWithProps((props: Props, theme) =>({
    background: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    content: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: props?.padding ?? theme.spacing.m,
        backgroundColor: theme.colors.background,
    }
}));
