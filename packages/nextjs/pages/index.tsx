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

  const writeDisabled = !chain || chain?.id !== getTargetNetwork().id;

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
        console.log("avatar data", ids[id], data);
        newAvatar["name"] = data["name"];
        const obj = {};
        data["attributes"].map(att => {
          obj[att["trait_type"]] = att["value"];
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
    if (!writeDisabled) {
      getAvatars();
    }
  }, [writeDisabled]);

  const handleTweet = (id: any) => {
    console.log("id tweet", id);
    const link1 = `${openseaBaseURL + id}`;
    const link2 = "https://pixster.vercel.app/";
    const text = `Checkout my coolest Avatar at: ${link1}\nMint yours at: ${link2}`;

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(tweetUrl, "_blank");
  };

  return (
    <>
      <Head>
        <title>Pixter: Home</title>
        <meta name="description" content="Create your very own NFT Avatars" />
        <link rel="shortcut icon" href="/pixters.png" />
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
                          <button className="btn btn-outline btn-success gap-2 ml-2">
                            <PencilSquareIcon className="h-3 w-3" /> Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            handleTweet(avatar["id"]);
                          }}
                          className="btn btn-outline btn-success gap-2 ml-2"
                        >
                          <Image width={25} height={25} src={"/twitter.png"}></Image>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div role="status" className="p-10">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>

                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
