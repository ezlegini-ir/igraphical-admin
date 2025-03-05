import TutorForm from "@/components/forms/tutor/TutorForm";
import NewButton from "@/components/NewButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import prisma from "@/prisma/client";
import TutorsList from "./TutorsList";
interface Props {
  searchParams: Promise<{ page: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;

  const pageSize = 15;

  const tutors = await prisma.tutor.findMany({
    orderBy: { joinedAt: "asc" },
    include: { image: true },

    skip: ((+page || 1) - 1) * pageSize,
    take: pageSize,
  });
  const totalTutors = await prisma.tutor.count();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>Tutors</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <NewButton />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Tutor</DialogTitle>
                <TutorForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TutorsList
        tutors={tutors}
        totalTutors={totalTutors}
        pageSize={pageSize}
      />
    </div>
  );
};

export default page;
