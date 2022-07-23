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
    maticmum: {
        name: "maticmum",
        chainId: 80001,
        transactionExplorer: "https://mumbai.polygonscan.com/tx/",
        accountExplorer: "https://mumbai.polygonscan.com/address/",
        marketplaceExplorer: (contractAddress, tokenID) => `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenID}`,
        gasLimit: 400000
    },
    sokol_testnet: {
        name: "sokol_testnet",
        chainId: 77,
        transactionExplorer: "https://blockscout.com/poa/sokol/tx/",
        accountExplorer: "https://blockscout.com/poa/sokol/address/",
        // @todo find right explorer
        marketplaceExplorer: (contractAddress, tokenID) => ``,
        gasLimit: 400000
    },
    // polygon_mainnet: {
    //     name: "polygon_mainnet",
    //     chainId: 137,
    //     transactionExplorer: "https://polygonscan.com/tx/",
    //     accountExplorer: "https://polygonscan.com/address/",
    //     marketplaceExplorer: (contractAddress, tokenID) => `https://opensea.io/assets/matic/${contractAddress}/${tokenID}`,
    //     gasLimit: 400000
    // }
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
    // polygon_mainnet: {
    //     api: 'https://api.rarible.org/v0.1',
    //     blockchain: 'POLYGON',
    //     adminAddress: '0xD25A41039DEfD7c7F0fBF6Db3D1Df60b232c6067',
    //     //place1: address of ERC20 smart contract
    //     tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    //     limitOrderAddress: '0xb707d89D29c189421163515c59E42147371D6857'
    // },
    maticmum: {
        api: 'https://api-staging.rarible.org/v0.1',
        store: 'https://testnets.opensea.io',
        blockchain: 'POLYGON',
        characterContract: '0x610d1f5149031185b264245d340108c15a1a01dc',
        // thingContract: '0xA95107620a198d7B141B32E42FF298f935A97585',
        thingContract: '0xfa44bb5e1b8c7be977cd5001008bc1caeee16e6a',

        colorContract: '0x3b3c5c0e75163e89968300a077d45f69212d1beb',
        achievements: '0x104d6c9e710bec7558138a119e1d22d8ca477469',

        whiteListContract: '0x4a74ba982b0229fdb4c9e69930ad9bb4a8bf9810',
    },
    sokol_testnet: {
        api: null,
        store: 'https://testnets.opensea.io',
        blockchain: 'ETHEREUM',
        characterContract: '0xB62C4Ac91b2cAA1D002350A69934c394d4DA2283',
        // thingContract: '0xA95107620a198d7B141B32E42FF298f935A97585',
        thingContract: '0xeaE16eB54D9A2fd0a76BBD879539C2EC038cE2d1',

        colorContract: '0x610d1f5149031185b264245d340108c15a1a01dc',
        achievements: '0xfd13917ad315757645198d73c94def7ce007aafb',

        whiteListContract: '0x3b3c5c0e75163e89968300a077d45f69212d1beb',
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