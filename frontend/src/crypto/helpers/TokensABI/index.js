import Bundle from './BundleNFT.json'
import WhiteList from './EffectsAllowList.json'
import ERC721 from './ERC721.json'

export default {
    bundle: {
        ABI: Bundle.abi,
        bytecode: Bundle.bytecode
    },
    whiteList: {
        ABI: WhiteList.abi,
        bytecode: WhiteList.bytecode
    },
    default: {
        ABI: ERC721.abi,
        bytecode: ERC721.bytecode
    }
}