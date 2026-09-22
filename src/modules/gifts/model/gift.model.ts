import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ collection: 'gift', timestamps: true, versionKey: false })
export class Gift {
    @Prop({ type: SchemaTypes.String, required: true, unique: true })
    name: string

    @Prop({ type: SchemaTypes.Number, required: true, min: 0 })
    price_coin: number

    @Prop({ type: SchemaTypes.Number, required: true, min: 0, default: 0 })
    stock: number

    @Prop({ type: SchemaTypes.String, required: false })
    description: string

    @Prop({ type: SchemaTypes.String, required: false })
    image: string
}

export const GiftSchema = SchemaFactory.createForClass(Gift)
