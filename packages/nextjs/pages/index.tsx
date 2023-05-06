import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Avatar from "avataaars";
import type { NextPage } from "next";
import { BugAntIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  //just for testing
  const response = useScaffoldContractRead({
    contractName: "Pixters",
    functionName: "tokenURI",
    args: [1],
  });
  const tokenURI = response.data;
  console.log("return", tokenURI);
  if (!tokenURI) return;
  const jsonManifestString = atob(tokenURI.substring(29));
  console.log("jsonManifestString", jsonManifestString);
  const jsonManifest = JSON.parse(jsonManifestString);
  console.log("jsonManifest", jsonManifest);
  return (
    <>
      <Head>
        <title>Pixter: Home</title>
        <meta name="description" content="Create your very own Web3 Avatar" />
      </Head>

      <Link href="/edit/0" className="mt-8 mx-auto">
        <button className="btn btn-secondary">Mint New Avatar ✨</button>
      </Link>
      <div className="flex flex-row flex-wrap mx-auto mb-10">
        <Link href="/edit/1" className="mx-auto my-0 mt-10 lg:mx-4">
          <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center">
            <Avatar
              style={{ width: "100%", height: "100%" }}
              avatarStyle="Transparent"
              topType="ShortHairShortWaved"
              accessoriesType="Blank"
              hairColor="Black"
              facialHairType="Blank"
              clotheType="Hoodie"
              clotheColor="Black"
              eyeType="Happy"
              eyebrowType="Default"
              mouthType="Smile"
              skinColor="Light"
            />
            <h2 className="text-2xl font-bold mt-4">Kevin</h2>
          </div>
        </Link>

        <Link href="/edit/2" className="mx-auto my-0 mt-10 lg:mx-4">
          <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center">
            <Avatar
              style={{ width: "100%", height: "100%" }}
              avatarStyle="Transparent"
              topType="Hat"
              accessoriesType="Sunglasses"
              hairColor="Black"
              facialHairType="Blank"
              clotheType="GraphicShirt"
              clotheColor="Black"
              graphicType="Pizza"
              eyeType="Happy"
              eyebrowType="Default"
              mouthType="Eating"
              skinColor="Light"
            />
            <h2 className="text-2xl font-bold mt-4">Kevin Cool</h2>
          </div>
        </Link>

        <Link href="/edit/3" className="mx-auto my-0 mt-10 lg:mx-4">
          <div className="card card-compact w-11/12 lg:w-80 bg-base-100 shadow-xl p-3 items-center">
            <Avatar
              style={{ width: "100%", height: "100%" }}
              avatarStyle="Transparent"
              topType="ShortHairShortWaved"
              accessoriesType="Prescription02"
              hairColor="Black"
              facialHairType="Blank"
              clotheType="CollarSweater"
              clotheColor="Black"
              eyeType="Happy"
              eyebrowType="Default"
              mouthType="Serious"
              skinColor="Light"
            />
            <h2 className="text-2xl font-bold mt-4">Kevin Nerd</h2>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Home;
