import React from "react";
import {Any} from "cosmjs-types/google/protobuf/any";
import {MsgSaveProfile} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_profile";
import {toHex} from "@cosmjs/encoding";
import {EncodeObject} from "@cosmjs/proto-signing";
import {SaveProfileMessage} from "./SaveProfileMessage";
import {UnknownTxMessage} from "./UnknownTxMessage";
import {MessageSend} from "./MessageSend";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";


export type Props = {
    /**
     * The message to display.
     */
    message: Any | EncodeObject
}

export const TxMessage: React.FC<Props> = (props) => {

    const {typeUrl, value} = props.message;
    const isProtobuf = isProtobufMessage(props.message);

    if (typeUrl.endsWith("MsgSaveProfile")) {
        if (isProtobuf) {
            const msgSaveProfile = MsgSaveProfile.decode(value);
            return <SaveProfileMessage protobufObject={msgSaveProfile}/>
        } else {
            return <SaveProfileMessage encodeObject={value}/>
        }
    } else if (typeUrl.endsWith("MsgSend")) {
        if (isProtobuf) {
            const decodedMessage = MsgSend.decode(value);
            return <MessageSend protobufMessage={decodedMessage}/>
        } else {
            return <MessageSend encodeObject={value}/>
        }
    } else {
        return <UnknownTxMessage
            typeUrl={typeUrl}
            value={isProtobuf ? toHex(value) : JSON.stringify(value)}
        />
    }

}

function isProtobufMessage(msg: EncodeObject | Any): boolean {
    return msg.value.constructor === Uint8Array;
}