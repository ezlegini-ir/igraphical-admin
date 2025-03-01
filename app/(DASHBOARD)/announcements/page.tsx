import HomeSlidersForm, {
  Sliders,
} from "@/components/forms/announcement/HomeSlidersForm";
import NotifBarForm from "@/components/forms/announcement/NotifBarForm";
import PanelSlidersForm from "@/components/forms/announcement/PanelSlidersForm";
import { banner, profile2 } from "@/public";

const page = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <HomeSlidersForm sliders={homeSliders} />

      <PanelSlidersForm sliders={panelSliders} />
      <NotifBarForm notifBar={notifBar} />
    </div>
  );
};

const homeSliders: Sliders[] = [
  { active: true, image: profile2, link: "igraphical.ir/courses" },
  { active: false, image: "", link: "igraphical.ir/courses" },
  { active: true, image: banner, link: "igraphical.ir/courses" },
];

const panelSliders: Sliders[] = [
  { active: true, image: profile2, link: "igraphical.ir/courses" },
  { active: false, image: banner, link: "igraphical.ir/courses" },
];

const notifBar = {
  content: "آغاز جشنواره نوروزی 1403 تنها در one روز",
  link: "https://igraphical.ir/courses",
  active: true,
  bgColor: "",
  textColor: "",
};

export default page;
