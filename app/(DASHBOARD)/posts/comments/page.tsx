import CommentForm from "@/components/forms/dashboard/post/CommentForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewsList, { CommentType } from "./CommentsList";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const totalComments = 2;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3>Reviews</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Comment</DialogTitle>
                <CommentForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ReviewsList comments={reviews} totalComments={totalComments} />
    </div>
  );
};

const reviews: CommentType[] = [
  {
    id: 1,
    content:
      "سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش",
    post: { id: 1, title: "دوره جامع نرم افزارا دوبی ایلوستریتور" },
    createdAt: new Date(),
    user: {
      id: 1,
      email: "ezlegini.ir@gmail.com",
      firstName: "علیرضا",
      lastName: "ازلگینی",
    },
  },
];

export default page;
