import Avatar from "@/components/Avatar";
import { avatar, profile } from "@/public";
import { Star } from "lucide-react";
import CardBox from "./CardBox";

export type ReviewType = {
  id: number;
  content: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  rate: number;
  createdAt: Date;
  course: {
    id: number;
    title: string;
  };
};

export interface ReviewCardProps {
  review: ReviewType;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <CardBox title={review.course.title}>
      <p className=" text-sm">{review.content}</p>
      <div className="flex gap-2">
        <Avatar src={avatar} />

        <div>
          <span className="text-sm font-medium">
            {review.user.firstName} {review.user.lastName}
          </span>

          <div className="flex gap-4 text-gray-400 text-[10px] font-medium">
            <span className="flex gap-1 items-center ">
              <Star size={13} fill="#fb923c" className="text-orange-400" />
              {review.rate}
            </span>

            <span className="flex gap-1 items-center ">
              {review.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </CardBox>
  );
};

export default ReviewCard;
