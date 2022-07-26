import {ethers} from "ethers";
// import {abi as ERC721_CONTRACT_ABI} from "@/contracts/ERC721.json";
// import {abi as BUNDLE_NFT_CONTRACT_ABI} from "@/contracts/BundleNFT.json";
// import {tokenFormat} from "@/utils/formatter";
// import getStorage from "@/utils/storage";

/*
*   @param provider - from connector.connection.subscribe
* */
export function getProvider(provider) {
    return new ethers.providers.Web3Provider(provider, "any")
}

// export function getContract(provider, contractAddress) {
//     return new ethers.Contract(contractAddress, ERC721_CONTRACT_ABI, provider);
// }
//
// export function getEtherContractForBundle(provider, contractAddress) {
//     return new ethers.Contract(contractAddress, BUNDLE_NFT_CONTRACT_ABI, provider);
// }