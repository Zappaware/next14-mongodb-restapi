import connect from '@/lib/db';
import User from '@/lib/modals/users';
import Category from "@/lib/modals/category";
import {NextResponse} from "next/server";
import { Types } from 'mongoose';

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse('Missing required fields', {status: 400});
        }

        await connect();

        const user = await User.findById(userId);

        if(!user){
            return new NextResponse('User not found', {status: 404});
        }

        const categories = await Category.find({user: new Types.ObjectId(userId)});

        return new NextResponse(JSON.stringify(categories), {status: 200});

    } catch (error: any) {
        return new NextResponse('Error in fetching categories' + error.message, {status: 500});
    }
}

export const POST = async (req: Request) => {
    try {
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get('userId');

        const { title } = await req.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid or missing ID', {status: 400});
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse('User not found', {status: 404});
        }


        const newCategory = new Category({title, user: new Types.ObjectId(userId)});
        await newCategory.save();

        return new NextResponse(JSON.stringify({message:'Category is created ', category: newCategory}), {status: 201});
    } catch (error: any) {
        return new NextResponse('Error in creating category' + error.message, {status: 500});
    }
}

