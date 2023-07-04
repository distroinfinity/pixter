import { Dispatch, SetStateAction } from "react";
import Avatar from "avataaars";
import { IAvatar, TActiveTab, TAvatarProperties } from "~~/types/custom";

const tabToProp = {
  Skin: "skinColor",
  Hair: "topType",
  HairColor: "hairColor",
  Eyebrow: "eyebrowType",
  Eyes: "eyeType",
  EyeWear: "accessoriesType",
  Mouth: "mouthType",
  FacialHair: "facialHairType",
  FacialHairColor: "facialHairColor",
  Clothes: "clotheType",
  ClotheColor: "clotheColor",
  Graphics: "graphicType",
  Accessories: "topType",
  AccessoriesColor: "hatColor",
};

export const Option = ({
  option,
  activeTab,
  avatar,
  setAvatar,
}: {
  option: string;
  activeTab: TActiveTab;
  avatar: IAvatar | undefined;
  setAvatar: Dispatch<SetStateAction<IAvatar | undefined>>;
}) => {
  if (avatar === undefined) {
    return <div className="animate-pulse bg-[#7f7f7f30] rounded-[12px] h-[166px] w-[166px] m-2"></div>;
  }

  const newProps = { ...avatar, [tabToProp[activeTab]]: option };

  return (
    <div
      className={`p-2 m-2 w-[166px] border rounded-[12px] ${
        avatar[tabToProp[activeTab] as TAvatarProperties] === option
          ? "border-success bg-[#00c85320]"
          : "bg-[#7f7f7f20] hover:bg-[#7f7f7f60] hover:cursor-pointer"
      }`}
      onClick={() => {
        setAvatar(newProps);
      }}
    >
      <Avatar style={{ width: "150px", height: "150px" }} {...newProps} />
    </div>
  );
};
