import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "avataaars";
import type { NextPage } from "next";
import { useWaitForTransaction } from "wagmi";
import { Pallette } from "~~/components/editAvatar/Pallette";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Edit: NextPage = () => {
  const router = useRouter();
  const { tokenId } = router.query;

  const [avatar, setAvatar] = useState();
  const [name, setName] = useState("");

  const [oldAvatarDetails, setOldAvatarDetails] = useState();

  const { data: oldAvatarFetched } = useScaffoldContractRead({
    contractName: "Pixters",
    functionName: "tokenURI",
    args: tokenId ? tokenId : [],
  });

  const generateArgs = () => {
    const args = [];
    if (oldAvatarDetails) {
      args.push(oldAvatarDetails["id"]);
      if (oldAvatarDetails["name"] === name) {
        args.push("");
      } else {
        args.push(name);
      }
      for (const key in avatar) {
        if (oldAvatarDetails["avatar"][key] === avatar[key]) {
          args.push("");
        } else {
          args.push(avatar[key]);
        }
      }
    }
    return args;
  };

  const { data: w1d, writeAsync: w1 } = useScaffoldContractWrite({
    contractName: "Pixters",
    functionName: "editAvatar",
    args: generateArgs(),
  });

  const { data: w1r } = useWaitForTransaction({
    hash: w1d?.hash,
  });

  useEffect(() => {
    if (w1r !== undefined) {
      router.push("/");
    }
  }, [w1r]);

  useEffect(() => {
    if (oldAvatarFetched) {
      const data = JSON.parse(atob(oldAvatarFetched.substring(29)));
      const obj = {};
      data["attributes"].map(attribute => {
        obj[attribute["trait_type"]] = attribute["value"];
      });
      setOldAvatarDetails({ id: tokenId, name: data["name"], avatar: obj });
      setName(data["name"]);
      setAvatar(obj);
    }
  }, [oldAvatarFetched]);

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
            {oldAvatarDetails["name"] === name ? (
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
