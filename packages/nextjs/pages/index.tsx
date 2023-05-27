import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
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
  const [loading, setLoading] = useState(false);

  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/" + scaffoldConfig.alchemyApiKey,
  );
  const providerContract = new ethers.Contract(
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["address"],
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["abi"],
    provider,
  );

  const isWalletReady = chain && chain?.id === getTargetNetwork().id;

  const openseaBaseURL =
    "https://testnets.opensea.io/assets/mumbai/" +
    contracts[scaffoldConfig.targetNetwork.id][0]["contracts"]["Pixters"]["address"] +
    "/";

  const getAvatars = async () => {
    try {
      setLoading(true);
      const ids = await providerContract.myAvatars(address);

      const newAvatars = [];
      for (const id in ids) {
        const newAvatar = {};
        newAvatar["id"] = parseInt(ids[id]);
        const rawData = await providerContract.tokenURI(newAvatar["id"]);
        const data = JSON.parse(atob(rawData.substring(29)));
        newAvatar["name"] = data["name"];
        const obj = {};
        data["attributes"].map(attribute => {
          obj[attribute["trait_type"]] = attribute["value"];
        });
        newAvatar["avatar"] = obj;
        newAvatars.push(newAvatar);
      }
      setAvatars(newAvatars);
      setLoading(false);
    } catch (error) {
      console.error(error);
      notification.error("Something went wrong in fetching your avatars!");
    }
  };

  useEffect(() => {
    if (isWalletReady) {
      getAvatars();
    }
  }, [isWalletReady]);

  const handleTweet = (id: any) => {
    const link1 = `${openseaBaseURL + id}`;
    const link2 = "https://pixters.vercel.app/";
    const text = `Checkout my coolest Avatar at: ${link1}\nMint yours at: ${link2}`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(tweetUrl, "_blank");
  };

  return (
    <>
      <Head>
        <title>Pixters: Home</title>
        <meta name="description" content="Create your very own NFT Avatars" />
        <link rel="shortcut icon" href="/pixters.png" />
      </Head>

      {!isWalletReady ? (
        <button className="mt-8 mx-auto btn btn-secondary" disabled>
          Mint New Avatar ✨
        </button>
      ) : (
        <Link href="/mint" className="mt-8 mx-auto">
          <button className="btn btn-secondary">Mint New Avatar ✨</button>
        </Link>
      )}
      {!isWalletReady ? (
        ""
      ) : (
        <>
          <div className="flex flex-row flex-wrap justify-center mb-10">
            {!loading ? (
              avatars?.map((avatar, index) => {
                return (
                  <div className=" mx-auto my-0 mt-10 lg:mx-4" key={index}>
                    <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center ml-3 lg:m-0">
                      <Avatar {...avatar["avatar"]} />
                      <h2 className="text-2xl font-bold mt-4">{avatar["name"]}</h2>
                      <div className="my-2 flex">
                        <a target="_blank" href={`${openseaBaseURL + avatar["id"]}`}>
                          <button className="btn btn-outline btn-info gap-2 mr-2">
                            <ArrowTopRightOnSquareIcon className="h-3 w-3" /> Opensea
                          </button>
                        </a>
                        <Link href={`/edit/${avatar["id"]}`}>
                          <button className="btn btn-outline btn-success gap-2 ml-2 mr-2">
                            <PencilSquareIcon className="h-3 w-3" /> Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            handleTweet(avatar["id"]);
                          }}
                          className="btn btn-outline ml-2"
                        >
                          <Image width={25} height={25} src={"/twitter.png"} alt="twitter logo"></Image>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className=" mx-auto my-0 mt-10 lg:mx-4">
                  <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center ml-3 lg:m-0">
                    <div className="animate-pulse bg-[#7f7f7f30] rounded-2xl h-[256px] w-[224px] mt-[22px]"></div>
                    <div className="mt-4 animate-pulse bg-[#7f7f7f30] rounded-2xl h-[40px] w-[124px]"></div>
                    <div className="my-2 flex">
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[104px] mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[84px] ml-2 mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[60px] ml-2"></div>
                    </div>
                  </div>
                </div>
                <div className=" mx-auto my-0 mt-10 lg:mx-4">
                  <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center ml-3 lg:m-0">
                    <div className="animate-pulse bg-[#7f7f7f30] rounded-2xl h-[256px] w-[224px] mt-[22px]"></div>
                    <div className="mt-4 animate-pulse bg-[#7f7f7f30] rounded-2xl h-[40px] w-[124px]"></div>
                    <div className="my-2 flex">
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[104px] mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[84px] ml-2 mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[60px] ml-2"></div>
                    </div>
                  </div>
                </div>
                <div className=" mx-auto my-0 mt-10 lg:mx-4">
                  <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center ml-3 lg:m-0">
                    <div className="animate-pulse bg-[#7f7f7f30] rounded-2xl h-[256px] w-[224px] mt-[22px]"></div>
                    <div className="mt-4 animate-pulse bg-[#7f7f7f30] rounded-2xl h-[40px] w-[124px]"></div>
                    <div className="my-2 flex">
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[104px] mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[84px] ml-2 mr-2"></div>
                      <div className="mt-2 animate-pulse bg-[#7f7f7f30] rounded-full h-[46px] w-[60px] ml-2"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
