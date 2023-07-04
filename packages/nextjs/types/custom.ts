import { BigNumber } from "ethers";

export interface IAvatar {
  avatarStyle: string;
  skinColor: string;
  topType: string;
  hatColor: string;
  hairColor: string;
  eyebrowType: string;
  eyeType: string;
  accessoriesType: string;
  mouthType: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  graphicType: string;
}

export type TAvatarProperties =
  | "avatarStyle"
  | "skinColor"
  | "topType"
  | "hatColor"
  | "hairColor"
  | "eyebrowType"
  | "eyeType"
  | "accessoriesType"
  | "mouthType"
  | "facialHairType"
  | "facialHairColor"
  | "clotheType"
  | "clotheColor"
  | "graphicType";

export type TMintItemArgs = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type TActiveTab =
  | "Skin"
  | "Hair"
  | "HairColor"
  | "Eyebrow"
  | "Eyes"
  | "EyeWear"
  | "Mouth"
  | "FacialHair"
  | "FacialHairColor"
  | "Clothes"
  | "ClotheColor"
  | "Graphics"
  | "Accessories"
  | "AccessoriesColor";

export interface IOldAvatarDetails {
  id: string | undefined;
  name: string | undefined;
  avatar: IAvatar | undefined;
}

export type TEditAvatarArgs = [
  BigNumber,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
