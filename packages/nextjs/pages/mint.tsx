import { Dispatch, SetStateAction, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "avataaars";
import type { NextPage } from "next";
import { Pallette } from "~~/components/editAvatar/Pallette";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { IAvatar, TMintItemArgs } from "~~/types/custom";
import { notification } from "~~/utils/scaffold-eth";

const Mint: NextPage = () => {
  const router = useRouter();

  const [avatar, setAvatar] = useState<IAvatar>({
    avatarStyle: "Transparent",
    skinColor: "Light",
    topType: "NoHair",
    hatColor: "Black",
    hairColor: "BrownDark",
    eyebrowType: "Default",
    eyeType: "Default",
    accessoriesType: "Blank",
    mouthType: "Default",
    facialHairType: "Blank",
    facialHairColor: "BrownDark",
    clotheType: "ShirtCrewNeck",
    clotheColor: "Black",
    graphicType: "Bat",
  });
  const [name, setName] = useState("");

  const { writeAsync: w1 } = useScaffoldContractWrite({
    contractName: "Pixters",
    functionName: "mintItem",
    args: avatar
      ? ([name].concat(Object.values(avatar)) as TMintItemArgs)
      : ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    onBlockConfirmation: () => {
      router.push("/");
    },
  });

  return (
    <>
      <Head>
        <title>Pixters: Mint</title>
        <meta name="description" content="Create your very own NFT Avatars" />
        <link rel="shortcut icon" href="/pixters.png" />
      </Head>

      <div className="flex flex-col items-center w-full">
        <div className="mt-6">
          <Avatar {...avatar} />
        </div>
        <div className="mt-6 flex gap-2">
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          className="btn btn-secondary mt-4"
          onClick={() => {
            if (name === "") {
              notification.error("Avatar name not entered!");
            } else {
              w1();
            }
          }}
        >
          Mint ✨
        </button>
        <div className="mt-6 px-3 w-full">
          <Pallette avatar={avatar} setAvatar={setAvatar as Dispatch<SetStateAction<IAvatar | undefined>>} />
        </div>
      </div>
    </>
  );
};

export default Mint;
