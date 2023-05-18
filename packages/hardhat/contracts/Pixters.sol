//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "./HexStrings.sol";

contract Pixters is ERC721, Ownable {
  using Strings for uint256;
  using HexStrings for uint160;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // State Variables
  mapping(uint256 => string) _nftName;
  mapping(uint256 => string) _avatarStyle;
  mapping(uint256 => string) _skinColor;
  mapping(uint256 => string) _topType;
  mapping(uint256 => string) _hatColor;
  mapping(uint256 => string) _hairColor;
  mapping(uint256 => string) _eyebrowType;
  mapping(uint256 => string) _eyeType;
  mapping(uint256 => string) _accessoriesType;
  mapping(uint256 => string) _mouthType;
  mapping(uint256 => string) _facialHairType;
  mapping(uint256 => string) _facialHairColor;
  mapping(uint256 => string) _clotheType;
  mapping(uint256 => string) _clotheColor;
  mapping(uint256 => string) _graphicType;

  constructor(address _owner) ERC721("Pixters", "PIXIS") {}

  // functions
  function mintItem(
    string memory name,
    string memory avatarStyle,
    string memory skinColor,
    string memory topType,
    string memory hatColor,
    string memory hairColor,
    string memory eyebrowType,
    string memory eyeType,
    string memory accessoriesType,
    string memory mouthType,
    string memory facialHairType,
    string memory facialHairColor,
    string memory clotheType,
    string memory clotheColor,
    string memory graphicType
  ) public returns (uint256) {
    _tokenIds.increment();
    uint256 id = _tokenIds.current();
    _mint(msg.sender, id);

    _nftName[id] = name;
    _avatarStyle[id] = avatarStyle;
    _skinColor[id] = skinColor;
    _topType[id] = topType;
    _hatColor[id] = hatColor;
    _hairColor[id] = hairColor;
    _eyebrowType[id] = eyebrowType;
    _eyeType[id] = eyeType;
    _accessoriesType[id] = accessoriesType;
    _mouthType[id] = mouthType;
    _facialHairType[id] = facialHairType;
    _facialHairColor[id] = facialHairColor;
    _clotheType[id] = clotheType;
    _clotheColor[id] = clotheColor;
    _graphicType[id] = graphicType;

    return id;
  }

  function editAvatar(
    uint256 _id,
    string memory name,
    string memory avatarStyle,
    string memory skinColor,
    string memory topType,
    string memory hatColor,
    string memory hairColor,
    string memory eyebrowType,
    string memory eyeType,
    string memory accessoriesType,
    string memory mouthType,
    string memory facialHairType,
    string memory facialHairColor,
    string memory clotheType,
    string memory clotheColor,
    string memory graphicType
  ) public {
    require(msg.sender == ownerOf(_id), "You are not the owner of this NFT");
    if (bytes(name).length > 0) {
      _nftName[_id] = name;
    }
    if (bytes(avatarStyle).length > 0) {
      _avatarStyle[_id] = avatarStyle;
    }
    if (bytes(skinColor).length > 0) {
      _skinColor[_id] = skinColor;
    }
    if (bytes(topType).length > 0) {
      _topType[_id] = topType;
    }
    if (bytes(hatColor).length > 0) {
      _hatColor[_id] = hatColor;
    }
    if (bytes(hairColor).length > 0) {
      _hairColor[_id] = hairColor;
    }
    if (bytes(eyebrowType).length > 0) {
      _eyebrowType[_id] = eyebrowType;
    }
    if (bytes(eyeType).length > 0) {
      _eyeType[_id] = eyeType;
    }
    if (bytes(accessoriesType).length > 0) {
      _accessoriesType[_id] = accessoriesType;
    }
    if (bytes(mouthType).length > 0) {
      _mouthType[_id] = mouthType;
    }
    if (bytes(facialHairType).length > 0) {
      _facialHairType[_id] = facialHairType;
    }
    if (bytes(facialHairColor).length > 0) {
      _facialHairColor[_id] = facialHairColor;
    }
    if (bytes(clotheType).length > 0) {
      _clotheType[_id] = clotheType;
    }
    if (bytes(clotheColor).length > 0) {
      _clotheColor[_id] = clotheColor;
    }
    if (bytes(graphicType).length > 0) {
      _graphicType[_id] = graphicType;
    }
  }

  function myAvatars(address _addr) public view returns (uint256[] memory) {
    uint256[] memory myAvatarsArr = new uint256[](balanceOf(_addr));
    uint256 index = 0;
    for (uint256 i = 1; i <= _tokenIds.current(); i++) {
      if (ownerOf(i) == _addr) {
        myAvatarsArr[index] = i;
        index++;
      }
    }
    return myAvatarsArr;
  }

  function getQueryString(uint256 id) private view returns (string memory) {
    string memory queryParams = string(
      abi.encodePacked(
        "?avatarStyle=",
        _avatarStyle[id],
        "&skinColor=",
        _skinColor[id],
        "&topType=",
        _topType[id],
        "&hatColor=",
        _hatColor[id],
        "&hairColor=",
        _hairColor[id],
        "&eyebrowType=",
        _eyebrowType[id],
        "&eyeType=",
        _eyeType[id],
        "&accessoriesType=",
        _accessoriesType[id],
        "&mouthType=",
        _mouthType[id],
        "&facialHairType=",
        _facialHairType[id],
        "&facialHairColor=",
        _facialHairColor[id],
        "&clotheType=",
        _clotheType[id],
        "&clotheColor=",
        _clotheColor[id],
        "&graphicType=",
        _graphicType[id]
      )
    );
    return queryParams;
  }

  function getAttributes(uint256 id) private view returns (string memory) {
    string memory attributes = string(
      abi.encodePacked(
        '{ "trait_type": "avatarStyle", "value" :"',
        _avatarStyle[id],
        '"},{"trait_type": "skinColor", "value" :"',
        _skinColor[id],
        '" }, {"trait_type": "topType", "value" :"',
        _topType[id],
        '"} ,{"trait_type": "hatColor", "value" :"',
        _hatColor[id],
        '"},{"trait_type": "hairColor", "value" :"',
        _hairColor[id],
        '"}, {"trait_type": "eyebrowType", "value" :"',
        _eyebrowType[id],
        '"}, {"trait_type": "eyeType", "value" :"',
        _eyeType[id],
        '"}, {"trait_type": "accessoriesType", "value" :"',
        _accessoriesType[id],
        '"},{"trait_type": "mouthType", "value" :"',
        _mouthType[id],
        '"}, {"trait_type": "facialHairType", "value" :"',
        _facialHairType[id],
        '"},{"trait_type": "facialHairColor", "value" :"',
        _facialHairColor[id],
        '"}, {"trait_type": "clotheType", "value" :"',
        _clotheType[id],
        '"}, {"trait_type": "clotheColor", "value" :"',
        _clotheColor[id],
        '"},{"trait_type": "graphicType", "value" :"',
        _graphicType[id],
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
