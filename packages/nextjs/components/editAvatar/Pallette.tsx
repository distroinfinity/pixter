import { Dispatch, SetStateAction, useState } from "react";
import { Tab } from "./Tab";
import { IAvatar, TActiveTab } from "~~/types/custom";

const tabs = [
  ["Skin", "Skin"],
  ["Hair", "Hair"],
  ["HairColor", "HairColor"],
  ["Eyebrow", "Eyebrow"],
  ["Eyes", "Eyes"],
  ["EyeWear", "EyeWear"],
  ["Mouth", "Mouth"],
  ["FacialHair", "FacialHair"],
  ["FacialHairColor", "FacialHairColor"],
  ["Clothes", "Clothes"],
  ["ClotheColor", "ClotheColor"],
  ["Graphics", "Graphics"],
  ["Accessories", "Accessories"],
  ["AccessoriesColor", "AccessoriesColor"],
];

export const Pallette = ({
  avatar,
  setAvatar,
}: {
  avatar: IAvatar | undefined;
  setAvatar: Dispatch<SetStateAction<IAvatar | undefined>>;
}) => {
  const [activeTab, setActiveTab] = useState<TActiveTab>("Skin");

  if (avatar === undefined) {
    return (
      <>
        <div className="tabs w-full flex-nowrap overflow-scroll lg:overflow-hidden">
          {tabs.map((tab, index) => {
            return (
              <a key={index} className="tab flex-grow hover:cursor-default">
                <div className="animate-pulse bg-[#7f7f7f30] rounded-lg h-[22px] w-[124px]"></div>
              </a>
            );
          })}
        </div>
        <Tab activeTab={activeTab} avatar={avatar} setAvatar={setAvatar} />
      </>
    );
  }

  return (
    <>
      <div className="tabs w-full flex-nowrap overflow-scroll lg:overflow-hidden">
        {tabs.map((tab, index) => {
          if (
            !(
              (tab[0] === "HairColor" &&
                [
                  "NoHair",
                  "Eyepatch",
                  "Hat",
                  "Hijab",
                  "Turban",
                  "WinterHat1",
                  "WinterHat2",
                  "WinterHat3",
                  "WinterHat4",
                  "LongHairFrida",
                  "LongHairShavedSides",
                ].includes(avatar["topType"])) ||
              (tab[0] === "EyeWear" && avatar["topType"] === "Eyepatch") ||
              ((tab[0] === "FacialHair" || tab[0] === "FacialHairColor") && avatar["topType"] === "Hijab") ||
              (tab[0] === "AccessoriesColor" &&
                !["Hijab", "Turban", "WinterHat1", "WinterHat2", "WinterHat3", "WinterHat4"].includes(
                  avatar["topType"],
                )) ||
              (tab[0] === "ClotheColor" && ["BlazerShirt", "BlazerSweater"].includes(avatar["clotheType"])) ||
              (tab[0] === "Graphics" && avatar["clotheType"] !== "GraphicShirt") ||
              (tab[0] === "FacialHairColor" && avatar["facialHairType"] === "Blank")
            )
          ) {
            return (
              <a
                key={index}
                className={`tab tab-bordered flex-grow ${activeTab === tab[0] ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab[0] as TActiveTab)}
              >
                {tab[1]}
              </a>
            );
          }
        })}
      </div>
      <Tab activeTab={activeTab} avatar={avatar} setAvatar={setAvatar} />
    </>
  );
};
