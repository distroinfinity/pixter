import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "avataaars";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { Pallette } from "~~/components/editAvatar/Pallette";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { IAvatar, IOldAvatarDetails, TAvatarProperties, TEditAvatarArgs } from "~~/types/custom";
import { notification } from "~~/utils/scaffold-eth";

const Edit: NextPage = () => {
  const router = useRouter();
  const { tokenId } = router.query;

  const [avatar, setAvatar] = useState<IAvatar>();
  const [name, setName] = useState("");

  const [oldAvatarDetails, setOldAvatarDetails] = useState<IOldAvatarDetails>();

  const { data: oldAvatarFetched } = useScaffoldContractRead({
    contractName: "Pixters",
    functionName: "tokenURI",
    args: tokenId ? [BigNumber.from(tokenId)] : [undefined],
  });

  const generateArgs = () => {
    const args = [];
    if (oldAvatarDetails) {
      args.push(BigNumber.from(oldAvatarDetails["id"]));
      if (oldAvatarDetails["name"] === name) {
        args.push("");
      } else {
        args.push(name);
      }
      for (const key in avatar) {
        if (oldAvatarDetails["avatar"]?.[key as TAvatarProperties] === avatar[key as TAvatarProperties]) {
          args.push("");
        } else {
          args.push(avatar[key as TAvatarProperties]);
        }
      }
    }
    return args as TEditAvatarArgs;
  };

  const { writeAsync: w1 } = useScaffoldContractWrite({
    contractName: "Pixters",
    functionName: "editAvatar",
    args: generateArgs(),
    onBlockConfirmation: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    if (oldAvatarFetched) {
      const data = JSON.parse(atob(oldAvatarFetched.substring(29)));
      const obj: IAvatar = {
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
      };
      data["attributes"].map((attribute: { trait_type: string; value: string }) => {
        obj[attribute["trait_type"] as TAvatarProperties] = attribute["value"];
      });
      setOldAvatarDetails({ id: tokenId as string, name: data["name"], avatar: obj });
      setName(data["name"]);
      setAvatar(obj);
    }
  }, [oldAvatarFetched, tokenId]);

  return (
    <>
      <Head>
        <title>Pixters: Edit</title>
        <meta name="description" content="Create your very own NFT Avatars" />
        <link rel="shortcut icon" href="/pixters.png" />
      </Head>

      <div className="flex flex-col items-center w-full">
        {avatar ? (
          <div className="mt-6">
            <Avatar {...avatar} />
          </div>
        ) : (
          <div className="animate-pulse bg-[#7f7f7f30] rounded-2xl h-[228px] w-[224px] mt-[64px]"></div>
        )}
        {avatar ? (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter Name"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
            />
            {oldAvatarDetails?.["name"] === name ? (
              ""
            ) : (
              <p className="text-xs m-0 mt-2 ml-4 flex gap-1">
                <p className="text-error m-0">Note:</p> Name has been edited
              </p>
            )}
          </div>
        ) : (
          <div className="mt-6 animate-pulse bg-[#7f7f7f30] rounded-full h-[48px] w-[218px]"></div>
        )}
        {avatar ? (
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
            Update 🚀
          </button>
        ) : (
          <div className="mt-4 animate-pulse bg-[#7f7f7f30] rounded-full h-[48px] w-[94px]"></div>
        )}
        <div className="mt-6 px-3 w-full">
          <Pallette avatar={avatar} setAvatar={setAvatar} />
        </div>
      </div>
    </>
  );
};

export default Edit;
