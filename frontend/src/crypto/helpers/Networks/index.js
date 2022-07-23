const networks = {
    rinkeby: {
        name: "rinkeby",
        chainId: 4,
        transactionExplorer: "https://rinkeby.etherscan.io/tx/",
        accountExplorer: "https://rinkeby.etherscan.io/address/",
        blockExplorer: "https://rinkeby.etherscan.io/tx/",
        marketplaceExplorer: (contractAddress, tokenID) => `https://testnets.opensea.io/assets/rinkeby/${contractAddress}/${tokenID}`,
        gasLimit: 400000
    },
    kovan_testnet: {
        name: "kovan_testnet",
        chainId: 42,
        transactionExplorer: "https://kovan.etherscan.io/tx",
        accountExplorer: "https://kovan.etherscan.io/address/",
        marketplaceExplorer: (contractAddress, tokenID) => `https://opensea.io/assets/ethereum/${contractAddress}/${tokenID}`,
        gasLimit: 400000
    },
    polygon_mainnet: {
        name: "polygon_mainnet",
        chainId: 137,
        transactionExplorer: "https://polygonscan.com/tx/",
        accountExplorer: "https://polygonscan.com/address/",
        marketplaceExplorer: (contractAddress, tokenID) => `https://opensea.io/assets/matic/${contractAddress}/${tokenID}`,
        gasLimit: 400000
    }
}

const settings = {
    kovan_testnet: {
        api: 'https://api.rarible.org/v0.1',
        blockchain: 'ETHEREUM',
        adminAddress: '0xD25A41039DEfD7c7F0fBF6Db3D1Df60b232c6067',
        //place1: address of ERC20 smart contract
        tokenAddress: '0xc2569dd7d0fd715B054fBf16E75B001E5c0C1115',
        limitOrderAddress: '0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f'
    },
    polygon_mainnet: {
        api: 'https://api.rarible.org/v0.1',
        blockchain: 'POLYGON',
        adminAddress: '0xD25A41039DEfD7c7F0fBF6Db3D1Df60b232c6067',
        //place1: address of ERC20 smart contract
        tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        limitOrderAddress: '0xb707d89D29c189421163515c59E42147371D6857'
    },
    sokol_testnet: {
        api: null,
        bundleContract: '0x5F2688F00b250E423C6b461115e9eff52f1D7434',
        effectsContract: '0x5533E63796a5ddFC28d996daF9E69A6B7Ed9878B',
        testContract: '0x369259905eE928ab1502DB060aBc5076480A86f5',
        store: '',
        blockchain: 'ETHEREUM',
        adminAddress: '0xD25A41039DEfD7c7F0fBF6Db3D1Df60b232c6067',

        characterContract: '0x2F0689f3bCEF57BeD577310e1c4f1275BE15394a',
        thingContract: '0x91b3Bcb5cb609CF307cb365124753a6Fb3bcC58A',
        colorContract: '0x55181Ea172ED9205252D559D782bA18488461303',
        achievements: '0xd4B754464c4C0Ea996C468A7e2B7E41Cc9494E40',

        whiteListContract: '0x458d5e59BA0590AfDFE1A55226Bd751C7a87477a',
    },
}

export function getNameByChainID(chainID){
    const [name] = Object.entries(networks).find(([, data]) => data.chainId === chainID) || ['unknown']
    let isSupport = (name !== 'unknown')? !!+process.env[`VUE_APP_NETWORK_${name.toUpperCase()}_SUPPORT`] : false

    return isSupport? name : 'unknown'
}

export function getData(networkName){
    return networks[networkName.toLowerCase()] || null
}

export function getSettings(networkName){
    return settings[networkName.toLowerCase()] || null
}