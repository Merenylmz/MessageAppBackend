import {Schema, model} from "mongoose";

export interface IUser{
    name: string,
    email: string,
    password: string,
    lastLoginToken: string,
    rememberToken: string,
}

const userSchema : Schema = new Schema<IUser>({
    name: String,
    email: String,
    password: String,
    lastLoginToken: {type: String, nullable: true},
    rememberToken: {type:String, nullable: true}
});


// kullanıcıyı savelemeden önce bcrypt ile passwordu hashliyor.
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//       return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });


const User = model<IUser>("User", userSchema);

export default User;

