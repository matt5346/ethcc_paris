export default {
    mode: 'test',   // or prod
    key: '5964ce5850654041ae0d631010671202',

    get options(){
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        }
        if(this.key) options.headers['X-API-KEY'] = this.key
        return options
    },
    get baseURL(){
        return (this.mode === 'test')? 'https://testnets-api.opensea.io/api/v1' : 'https://api.opensea.io/api/v1'
    },
    setKey(value){
        this.key = value
    },

    lastCall: Date.now(),

    async wait(){
        if(!this.key) {
            if(Date.now() - this.lastCall < 1100) await new Promise(resolve => setTimeout(resolve, 1100))
            this.lastCall = Date.now()
        }
    },

    async fetchContract(address){
        try{
            await this.wait()
            const request = await fetch(`${this.baseURL}/asset_contract/${address}`, this.options);
            const response = await request.json()
            return response
        }
        catch (e) {
            console.log('Error fetchContract', e)
            throw Error('API')
        }
    },

    async fetchToken(identity, userIdentity = null){
        try{
            await this.wait()
            // const request = await fetch(`${this.baseURL}/asset/${identity.replace(':', '/')}${userIdentity? '?account_address='+userIdentity:''}`, this.options);
            const request = await fetch(`${this.baseURL}/asset/${identity.replace(':', '/')}`, this.options);
            const response = await request.json()
            return response
        }
        catch (e) {
            console.log('Error fetchToken', e)
            throw Error('API')
        }
    },

    async fetchUserTokensByContract(contractAddress, userIdentity){
        await this.wait()
        const config = {
            owner: userIdentity,
            asset_contract_address: contractAddress,
            order_direction: 'desc',
            include_orders: false,
            offset: 0,
            limit: 50   // max
        }
        try{
            const params = new URLSearchParams(config)
            const request = await fetch(`${this.baseURL}/assets?` + params, this.options);
            const loadedTokens = await request.json()
            return Array.isArray(loadedTokens.assets)? loadedTokens.assets : []
        }
        catch (e) {
            console.log('Error fetchUserTokensByContract', e)
            throw Error('fetchUserTokensByContract')
        }
    }
}