import connect from '@/lib/db';
import User from '@/lib/modals/users';
import Category from "@/lib/modals/category";
import {NextResponse} from "next/server";
import { Types } from 'mongoose';

export const PATCH = async (req: Request, context:{params: any}) => {
    const categoryId  = context.params.category;

    try {
        const body = await req.json();
        const { title } = body;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse('Invalid or missing user', {status: 400});
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse('Invalid or missing category', {status: 400});
        }

        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse('User not found', {status: 404});
        }
        const category = await Category.findOne({_id: categoryId, user: userId});

        if (!category) {
            return new NextResponse('Category not found', {status: 404});
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {title}, {new: true});

        return new NextResponse(JSON.stringify({message: 'Category updated successfully', category: updatedCategory}), {status: 200});

    } catch (error: any) {
        return new NextResponse('Error in updating category' + error.message, {status: 500});
    }
}
