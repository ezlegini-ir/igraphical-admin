import MainSlidersForm from "@/components/forms/announcement/MainSlidersForm";
import NotifBarForm from "@/components/forms/announcement/NotifBarForm";
import PanelSlidersForm from "@/components/forms/announcement/PanelSlidersForm";
import prisma from "@/prisma/client";

const page = async () => {
  const mainSliders = await prisma.slider.findMany({
    where: {
      type: "MAIN",
    },
    include: {
      image: true,
    },
  });
  const panelSliders = await prisma.slider.findMany({
    where: {
      type: "PANEL",
    },
    include: {
      image: true,
    },
  });
  const notifBar = await prisma.notifbar.findFirst();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <MainSlidersForm sliders={mainSliders} />
      <PanelSlidersForm sliders={panelSliders} />

      <NotifBarForm notifBar={notifBar} />
    </div>
  );
};

export default page;
