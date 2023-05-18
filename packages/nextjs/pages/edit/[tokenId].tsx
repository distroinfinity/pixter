import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "avataaars";
import type { NextPage } from "next";
import { useWaitForTransaction } from "wagmi";
import { CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Pallette } from "~~/components/editAvatar/Pallette";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Edit: NextPage = () => {
  const router = useRouter();
  const { tokenId } = router.query;

  const [avatar, setAvatar] = useState();

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");

  const [oldAvatar, setOldAvatar] = useState();

  const { data: w1d, writeAsync: w1 } = useScaffoldContractWrite({
    contractName: "Pixters",
    functionName: "mintItem",
    args: avatar ? [name].concat(Object.values(avatar)) : [],
  });

  const { data: w1r } = useWaitForTransaction({
    hash: w1d?.hash,
  });

  useEffect(() => {
    if (w1r !== undefined) {
      router.push("/");
    }
  }, [w1r]);

  const { data: oldAvatarFetched } = useScaffoldContractRead({
    contractName: "Pixters",
    functionName: "tokenURI",
    args: tokenId ? tokenId : [],
  });

  const generateArgs = () => {
    const args = [];
    if (tokenId && oldAvatar) {
      args.push(tokenId);
      if (oldAvatar[0] === name) {
        args.push("");
      } else {
        args.push(name);
      }
      for (const key in avatar) {
        if (oldAvatar[1][key] === avatar[key]) {
          args.push("");
        } else {
          args.push(avatar[key]);
        }
      }
    }
    return args;
  };

  const { data: w2d, writeAsync: w2 } = useScaffoldContractWrite({
    contractName: "Pixters",
    functionName: "editAvatar",
    args: generateArgs(),
  });

  const { data: w2r } = useWaitForTransaction({
    hash: w2d?.hash,
  });

  useEffect(() => {
    if (w2r !== undefined) {
      router.push("/");
    }
  }, [w2r]);

  useEffect(() => {
    if (tokenId === "0" && avatar == undefined) {
      setEditName(true);
      setAvatar({
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
    } else {
      if (oldAvatarFetched) {
        const data = JSON.parse(atob(oldAvatarFetched.substring(29)));
        const obj = {};
        data["attributes"].map(att => {
          obj[att["trait_type"]] = att["value"];
        });
        setOldAvatar([data["name"], obj]);
        setName(data["name"]);
        setAvatar(obj);
      }
    }
  }, [tokenId, oldAvatarFetched]);

  const nameUpdate = () => {
    if (name != "") {
      setEditName(false);
    } else {
      notification.error("Avatar name not entered!");
    }
  };

  return (
    <>
      <Head>
        <title>Pixter: Edit</title>
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
        {editName ? (
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Enter Name"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  nameUpdate();
                }
              }}
            />
            <button className="btn btn-secondary" onClick={() => nameUpdate()}>
              <CheckIcon className="h-4 w-4" />
            </button>
          </div>
        ) : avatar ? (
          <div className="mt-6 flex gap-2">
            <h2 className="text-2xl font-bold text-center">{name}</h2>
            <PencilSquareIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                setEditName(true);
              }}
            />
          </div>
        ) : (
          <div className="mt-6 animate-pulse bg-[#7f7f7f30] rounded-2xl h-[40px] w-[124px]"></div>
        )}
        {avatar ? (
          tokenId === "0" ? (
            <button
              className="btn btn-secondary mt-4"
              onClick={() => {
                if (name === "" || editName) {
                  notification.error("Avatar name not entered!");
                } else {
                  w1();
                }
              }}
            >
              Mint ✨
            </button>
          ) : (
            <button
              className="btn btn-secondary mt-4"
              onClick={() => {
                if (name === "" || editName) {
                  notification.error("Avatar name not entered!");
                } else {
                  w2();
                }
              }}
            >
              Update 🚀
            </button>
          )
        ) : (
          ""
        )}
        <div className="mt-6 px-3 w-full">{avatar ? <Pallette avatar={avatar} setAvatar={setAvatar} /> : ""}</div>
      </div>
    </>
  );
};

export default Edit;
