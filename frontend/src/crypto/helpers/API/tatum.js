export default {
    mode: 'test',   // or prod
    key: '43d5fffb-4087-4498-b28e-64f493ac73d4',

    get options(){
        const options = {
            method: 'GET',
            headers: {
                'x-testnet-type': 'ethereum-rinkeby'
            }
        }
        if(this.key) options.headers['x-api-key'] = this.key
        return options
    },
    get baseURL(){
        return 'https://api-eu1.tatum.io/v3'
    },
    setKey(value){
        this.key = value
    },

    async fetchUserTokensByContract(contractAddress, userIdentity){
        try{
            const request = await fetch(`${this.baseURL}/nft/collection/ETH/` + contractAddress + '?type=testnet&pageSize=50', this.options);
            const loadedTokens = await request.json()
            return Array.isArray(loadedTokens.assets)? loadedTokens.assets : []
        }
        catch (e) {
            console.log('Error fetchUserTokensByContract', e)
            return []
        }
    },

    async fetchTokensFromContract(contractAddress){
        try{
            const config = new URLSearchParams({
                type: 'testnet',
                pageSize: 50
            })
            const request = await fetch(`${this.baseURL}/nft/collection/ETH/${contractAddress}${config}`, this.options);
            const loadedTokens = await request.json()
            return Array.isArray(loadedTokens) && loadedTokens || []
        }
        catch (e) {
            console.log('Error fetchTokensFromContract', e)
            return []
        }
    },

    async fetchUserTokens(userIdentity){
        try{
            const request = await fetch(`${this.baseURL}/address/balance/ETH/${userIdentity}`, this.options);
            const loadedTokens = await request.json()
            return Array.isArray(loadedTokens) && loadedTokens || []
        }
        catch (e) {
            console.log('Error fetchUserTokens', e)
            return []
        }
    },

    async fetchUserBalance(contractAddress, userIdentity){
        try{
            const request = await fetch(`${this.baseURL}/nft/balance/ETH/${contractAddress}/${userIdentity}`, this.options);
            const balance = await request.json()
            return Array.isArray(balance) && balance[0] || 0
        }
        catch (e) {
            console.log('Error fetchUserBalance', e)
            return []
        }
    }
}