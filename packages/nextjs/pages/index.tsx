import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Avatar from "avataaars";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount, useNetwork } from "wagmi";
import { ArrowTopRightOnSquareIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { contracts } from "~~/utils/scaffold-eth/contract";

const Home: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [avatars, setAvatars] = useState();

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/" + scaffoldConfig.alchemyApiKey,
  );
  const providerContract = new ethers.Contract(
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["address"],
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["abi"],
    provider,
  );

  const writeDisabled = !chain || chain?.id !== getTargetNetwork().id;

  const openseaBaseURL =
    "https://testnets.opensea.io/assets/mumbai/" +
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["address"] +
    "/";

  const getAvatars = async () => {
    try {
      const ids = await providerContract.myAvatars(address);
      const newAvatars = [];
      for (const id in ids) {
        const newAvatar = {};
        newAvatar["id"] = parseInt(ids[id]);
        const rawData = await providerContract.tokenURI(newAvatar["id"]);
        const data = JSON.parse(atob(rawData.substring(29)));
        newAvatar["name"] = data["name"];
        const obj = {};
        data["attributes"].map(att => {
          obj[att["trait_type"]] = att["value"];
        });
        newAvatar["avatar"] = obj;
        newAvatars.push(newAvatar);
      }
      setAvatars(newAvatars);
    } catch (error) {
      console.error(error);
      notification.error("Something went wrong in fetching your avatars!");
    }
  };

  useEffect(() => {
    if (!writeDisabled) {
      getAvatars();
    }
  }, [writeDisabled]);

  return (
    <>
      <Head>
        <title>Pixter: Home</title>
        <meta name="description" content="Create your very own Web3 Avatar" />
        <link rel="shortcut icon" href="/pixters.jpeg" />
      </Head>

      {writeDisabled ? (
        <button className="mt-8 mx-auto btn btn-secondary" disabled>
          Mint New Avatar ✨
        </button>
      ) : (
        <Link href="/edit/0" className="mt-8 mx-auto">
          <button className="btn btn-secondary">Mint New Avatar ✨</button>
        </Link>
      )}
      {writeDisabled ? (
        ""
      ) : (
        <>
          <div className="flex flex-row flex-wrap justify-center mb-10">
            {avatars?.map((avatar, index) => {
              return (
                <div className="mx-auto my-0 mt-10 lg:mx-4" key={index}>
                  <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center ml-3 lg:m-0">
                    <Avatar {...avatar["avatar"]} />
                    <h2 className="text-2xl font-bold mt-4">{avatar["name"]}</h2>
                    <div className="my-2">
                      <Link href={`${openseaBaseURL + avatar["id"]}`}>
                        <button className="btn btn-outline btn-info gap-2 mr-2">
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" /> Opensea
                        </button>
                      </Link>
                      <Link href={`/edit/${avatar["id"]}`}>
                        <button className="btn btn-outline btn-success gap-2 ml-2">
                          <PencilSquareIcon className="h-4 w-4" /> Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
