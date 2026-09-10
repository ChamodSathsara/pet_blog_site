import { getAuthors, getCategories } from '@/lib/db/queries';
import { PostEditor } from '../PostEditor';
export default async function NewPostPage(){const [categories,authors]=await Promise.all([getCategories(),getAuthors()]);return <><h1 className="font-serif text-3xl font-semibold">New post</h1><PostEditor categories={categories} authors={authors} initial={{title:'',slug:'',excerpt:'',content:'',coverImageUrl:'',coverAlt:'',categoryId:categories[0]?.id||'',authorId:authors[0]?.id||'',tags:[],status:'draft'}}/></>}
