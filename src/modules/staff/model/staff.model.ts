import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

// Xodimlar - o'qituvchi bo'lmagan, tizimga kirmaydigan xodimlar (menejer, marketolog va h.k.)
// Alohida tabel, Users kolleksiyasiga bog'lanmagan.
@Schema({ collection: 'staff', timestamps: true, versionKey: false })
export class Staff {
    @Prop({ type: SchemaTypes.String, required: true })
    first_name: string

    @Prop({ type: SchemaTypes.String, required: true })
    last_name: string

    @Prop({ type: SchemaTypes.String, required: true })
    phone: string

    @Prop({ type: SchemaTypes.String, required: true })
    position: string

    @Prop({ type: SchemaTypes.Number, required: true })
    salary: number

    @Prop({ type: SchemaTypes.String, required: true })
    hire_date: string

    @Prop({ type: SchemaTypes.String, required: false })
    address: string
}

export const StaffSchema = SchemaFactory.createForClass(Staff)
