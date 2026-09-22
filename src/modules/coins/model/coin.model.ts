import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Users } from "../../users/model/user.model";

@Schema({ collection: 'coin', timestamps: true, versionKey: false })
export class Coin {
    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: true })
    student_id: Types.ObjectId

    @Prop({ type: SchemaTypes.Number, required: true })
    amount: number

    @Prop({ type: SchemaTypes.String, required: true })
    reason: string

    @Prop({ type: SchemaTypes.ObjectId, ref: Users.name, required: false })
    given_by: Types.ObjectId
}

export const CoinSchema = SchemaFactory.createForClass(Coin)
