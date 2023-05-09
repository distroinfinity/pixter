import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "avataaars";
import type { NextPage } from "next";
import { CheckIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Pallette } from "~~/components/editAvatar/Pallette";
import { notification } from "~~/utils/scaffold-eth";

const Edit: NextPage = () => {
  const router = useRouter();
  const { tokenId } = router.query;

  const [avatar, setAvatar] = useState({
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

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (tokenId === "0") {
      setEditName(true);
    }
  }, [tokenId]);

  const nameUpdate = () => {
    if (name != "") {
      setEditName(false);
    } else {
      notification.error("Avatar name not entered!");
    }
  };

  const submit = () => {
    console.log("LFG");
  };

  return (
    <>
      <Head>
        <title>Pixter: Edit</title>
        <meta name="description" content="Create your very own Web3 Avatar" />
      </Head>

      <div className="flex flex-col items-center w-full">
        <Avatar {...avatar} />
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
        ) : (
          <div className="mt-6 flex gap-2">
            <h2 className="text-2xl font-bold text-center">{name}</h2>
            <PencilSquareIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                setEditName(true);
              }}
            />
          </div>
        )}
        <button
          className="btn btn-secondary mt-4"
          onClick={() => {
            submit();
          }}
        >
          {tokenId === "0" ? "Mint ✨" : "Update 🚀"}
        </button>
        <div className="mt-6 px-3 w-full">
          <Pallette avatar={avatar} setAvatar={setAvatar} />
        </div>
      </div>
    </>
  );
};

export default Edit;
