import ReviewForm from "@/components/forms/dashboard/course/ReviewForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewsList, { ReviewType } from "./ReviewsList";

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
                <ReviewForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ReviewsList reviews={reviews} totalReviews={totalComments} />
    </div>
  );
};

const reviews: ReviewType[] = [
  {
    id: 1,
    rate: 5,
    content:
      "سلام وقت بخیر تکنیک های چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی  چاپی دستگاه فلکسو و هلیو هم توی این دوره بصورت تخصصی آموزش داده میشه؟ من بیشتر نیازم به این دوره برای طراحی دایلاین های خاصه و بسته بندی فلکسو و استانداردهاش",
    course: { id: 1, title: "دوره جامع نرم افزارا دوبی ایلوستریتور" },
    createdAt: new Date(),
    user: {
      id: 1,
      firstName: "علیرضا",
      lastName: "ازلگینی",
    },
  },
];

export default page;
