import React from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import {BarCodeReadEvent} from "react-native-camera";

type Props = {
    onPairRequest? : (uri: string) => void,
}

export default function WalletConnectQRPair(props: Props): JSX.Element {

    const onQrCoreRead = (event: BarCodeReadEvent) => {
        if (props.onPairRequest !== undefined) {
            props.onPairRequest(event.data);
        }
    }

    return <QRCodeScanner onRead={onQrCoreRead} showMarker={true}/>
}