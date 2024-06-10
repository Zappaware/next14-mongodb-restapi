import connect from '@/lib/db';
import User from '@/lib/modals/users';
import {NextResponse} from "next/server";
import { Types } from 'mongoose';

const ObjectId = require('mongoose').Types.ObjectId;

export const GET = async () => {

    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (error: any) {
        return new NextResponse('Error in fetching users' + error.message, {status: 500});
    }

}

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({message:'User is created ', user: newUser}), {status: 201});
    } catch (error: any) {
        return new NextResponse('Error in creating user' + error.message, {status: 500});
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return new NextResponse('Missing required fields', {status: 400});
        }

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse('Invalid user id', {status: 400});
        }

        const updatedUser = await User.findByIdAndUpdate(
               {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true});


        if (!updatedUser) {
            return new NextResponse(JSON.stringify({message: 'User not found in database'}), {status: 400});
        }

        return new NextResponse(JSON.stringify({message: 'User updated successfully', user: updatedUser}), {status: 200});

    } catch (error: any) {
        return new NextResponse('Error in updating user' + error.message, {status: 500});
    }
}

export const DELETE = async (req: Request) => {
    try{
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if(!userId){
            return new NextResponse('ID not found', {status: 400});
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid user id', {status: 400});
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete({_id: new ObjectId(userId)});

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({message: 'User not found in database'}), {status: 400});
        }

        return new NextResponse(JSON.stringify({message: 'User deleted successfully', user: deletedUser}), {status: 200});

    } catch (error: any) {
        return new NextResponse('Error in deleting user' + error.message, {status: 500});
    }
}



