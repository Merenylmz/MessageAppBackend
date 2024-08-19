import mongoose from "mongoose";

interface IMessage {
    sender: string,
    receiver: string,
    content: string,
}


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },

}, {timestamps: true});


const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;