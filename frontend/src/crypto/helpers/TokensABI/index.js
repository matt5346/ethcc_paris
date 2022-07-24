import Bundle from './BundleNFT.json'
import WhiteList from './EffectsAllowList.json'
import ERC721 from './ERC721.json'
import ERC20 from './ERC20.json'

export default {
    bundle: {
        ABI: Bundle.abi,
        bytecode: Bundle.bytecode
    },
    whiteList: {
        ABI: WhiteList.abi,
        bytecode: WhiteList.bytecode
    },
    erc20: {
        ABI: ERC20
    },
    default: {
        ABI: ERC721.abi,
        bytecode: ERC721.bytecode
    }
}