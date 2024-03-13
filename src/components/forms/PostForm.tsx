import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import FileUpLoader from "../shared/FileUpLoader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"

type PostFormProps = {
  post?: Models.Document;
}

const PostForm = ({ post }: PostFormProps ) => {
  const {mutateAsync: createPost, isPending: isLoadingCreate} = useCreatePost();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(',') : "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {

    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
       toast({
          title: 'please try again',
       })
    }
    navigate('/')
  }
  return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field}  />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUpLoader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex shad-form_label">Add Location</FormLabel>
              <FormControl>
                <input type="text" className="shad-input" {...field} />
              </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex shad-form_label">Add Tags (separated by comma " , ") </FormLabel>
              <FormControl>
                <input
                  type="text"
                  className="shad-input"
                  placeholder="e.g. #travel, #nature, #photography"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">Cancel</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button> 
        </div>
      </form>
    </Form>
  )
}

export default PostForm
