//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "./HexStrings.sol";

import "hardhat/console.sol";

contract Pixters is ERC721, Ownable {
  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // State Variables
  mapping(uint256 => string) _nftName;
  mapping(uint256 => string) _topType;
  mapping(uint256 => string) _accessoriesType;
  mapping(uint256 => string) _hairColor;
  mapping(uint256 => string) _facialHairType;
  mapping(uint256 => string) _clotheType;
  mapping(uint256 => string) _clotheColor;
  mapping(uint256 => string) _eyeType;
  mapping(uint256 => string) _eyebrowType;
  mapping(uint256 => string) _mouthType;
  mapping(uint256 => string) _skinColor;

  constructor(address _owner) public ERC721("Pixters", "PIXIS") {}

  // functions
  function mintItem(
    string memory name,
    string memory topType,
    string memory accessoriesType,
    string memory hairColor,
    string memory facialHairType,
    string memory clotheType,
    string memory clotheColor,
    string memory eyeType,
    string memory eyebrowType,
    string memory mouthType,
    string memory skinColor
  ) public returns (uint256) {
    _tokenIds.increment();
    uint256 id = _tokenIds.current();
    _mint(msg.sender, id);

    _nftName[id] = name;
    _topType[id] = topType;
    _accessoriesType[id] = accessoriesType;
    _hairColor[id] = hairColor;
    _facialHairType[id] = facialHairType;
    _clotheType[id] = clotheType;
    _clotheColor[id] = clotheColor;
    _eyeType[id] = eyeType;
    _eyebrowType[id] = eyebrowType;
    _mouthType[id] = mouthType;
    _skinColor[id] = skinColor;

    return id;
  }

  function editAvatar(
    uint256 _id,
    string memory topType,
    string memory accessoriesType,
    string memory hairColor,
    string memory facialHairType,
    string memory clotheType,
    string memory clotheColor,
    string memory eyeType,
    string memory eyebrowType,
    string memory mouthType,
    string memory skinColor
  ) public {
    require(msg.sender == ownerOf(_id), "You are not the owner of this NFT");
    if (bytes(topType).length > 0) {
      _topType[_id] = topType;
    }
    if (bytes(accessoriesType).length > 0) {
      _accessoriesType[_id] = accessoriesType;
    }
    if (bytes(hairColor).length > 0) {
      _hairColor[_id] = hairColor;
    }
    if (bytes(facialHairType).length > 0) {
      _facialHairType[_id] = facialHairType;
    }
    if (bytes(clotheType).length > 0) {
      _clotheType[_id] = clotheType;
    }
    if (bytes(clotheColor).length > 0) {
      _clotheColor[_id] = clotheColor;
    }
    if (bytes(eyeType).length > 0) {
      _eyeType[_id] = eyeType;
    }
    if (bytes(eyebrowType).length > 0) {
      _eyebrowType[_id] = eyebrowType;
    }
    if (bytes(mouthType).length > 0) {
      _mouthType[_id] = mouthType;
    }
    if (bytes(skinColor).length > 0) {
      _skinColor[_id] = skinColor;
    }
  }

  // https://avataaars.io/?avatarStyle=Circle&topType=LongHairFro&accessoriesType=Prescription02&hairColor=BrownDark&facialHairType=Blank&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Hearts&eyebrowType=RaisedExcitedNatural&mouthType=Eating&skinColor=Pale

  function getQueryString(uint256 id) private view returns (string memory) {
    string memory queryParams = string(
      abi.encodePacked(
        "?topType=",
        _topType[id],
        "&accessoriesType=",
        _accessoriesType[id],
        "&hairColor=",
        _hairColor[id],
        "&facialHairType=",
        _facialHairType[id],
        "&clotheType=",
        _clotheType[id],
        "&clotheColor",
        _clotheColor[id],
        "&eyeType=",
        _eyeType[id],
        "&eyebrowType=",
        _eyebrowType[id],
        "&mouthType=",
        _mouthType[id],
        "&skinColor=",
        _skinColor[id]
      )
    );
    return queryParams;
  }

  function getAttributes(uint256 id) private view returns (string memory) {
    // adding a handful of them, baad mai fix it
    string memory attributes = string(
      abi.encodePacked(
        '{ "trait_type": "hairColor", "value" :"',
        _hairColor[id],
        '" }, {"trait_type": "topType", "value" :"',
        _topType[id],
        '"}, {"trait_type": "accessoriesType", "value" :"',
        _accessoriesType[id],
        '"}, {"trait_type": "facialHairType", "value" :"',
        _facialHairType[id],
        '"}, {"trait_type": "clotheType", "value" :"',
        _clotheType[id],
        '"}, {"trait_type": "clotheColor", "value" :"',
        _clotheColor[id],
        '"}, {"trait_type": "eyeType", "value" :"',
        _eyeType[id],
        '"}, {"trait_type": "eyebrowType", "value" :"',
        _eyebrowType[id],
        '"},{"trait_type": "mouthType", "value" :"',
        _mouthType[id],
        '"},{"trait_type": "skinColor", "value" :"',
        _skinColor[id],
        '"} '
      )
    );

    return attributes;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    require(_exists(id), "not exist");

    string memory name = string(abi.encodePacked(_nftName[id]));
    string memory description = string(abi.encodePacked("Coolest pfp in town"));
    string memory baseURI = "https://avataaars.io/";
    string memory queryParams = getQueryString(id);

    string memory dynamicImageUri = string(abi.encodePacked(baseURI, queryParams));
    string memory attributes = getAttributes(id);

    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                name,
                '", "description":"',
                description,
                '", "attributes": [',
                attributes,
                '], "owner":"',
                (uint160(ownerOf(id))).toHexString(20),
                '", "image": "',
                dynamicImageUri,
                '"}'
              )
            )
          )
        )
      );
  }
}
