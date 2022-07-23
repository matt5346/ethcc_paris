import Evm from "@/crypto/EVM";
import RaribleConnector from "@/crypto/EVM/rarible/Connector";
import SmartContract from "@/crypto/EVM/SmartContract";
import {AppStorage} from "@/crypto/helpers";

import {ErrorList} from "@/crypto/helpers"
import {ActionTypes} from "@/crypto/helpers"

class Rarible extends Evm{

    // controllerClass = null
    connector = RaribleConnector

    constructor(){
        super()
    }

    async createBundle(...props){
        const {
            resultTokenCID,
            contractAddress,
            tokensList,
            tempImage,
        } = await super.createBundle(...props)

        const storage = AppStorage.getStore()

        const contract = new SmartContract({
            address: contractAddress,
            type: 'bundle'
        })

        await contract.approveTokenList(tokensList, storage.setProcessStatus)

        storage.setProcessStatus(ActionTypes.adding_to_bundle)
        const result = await contract.makeBundle(tokensList, resultTokenCID, storage.setProcessStatus)

        return {
            transactionHash: result.transactionHash,
            tempImage
        }
    }

    async applyAssetsToToken(original, ...props){
        const originalToken = await this.getTokenByIdentity(original.identity, true, true)

        if(!originalToken.structure.length){
            return await this.createBundle(originalToken, ...props)
        }

        const {
            resultTokenCID,
            toTokenID,
            contractAddress,
            addTokenList,
            tempImage,
            permanentImage
            // tokensForBundle,
            // tokensForBundleIdentity,
            // metaCID,
        } = await super.applyAssetsToToken(original, ...props)

        const storage = AppStorage.getStore()

        const contract = new SmartContract({
            address: contractAddress,
            type: 'bundle'
        })

        await contract.approveTokenList(addTokenList, storage.setProcessStatus)

        storage.setProcessStatus(ActionTypes.adding_to_bundle)
        const result = await contract.addToBundle(toTokenID, addTokenList, resultTokenCID)

        return {
            transactionHash: result.transactionHash,
            tempImage
        }
    }

    async removeAssetsFromBundle(...props){
        const {
            resultTokenCID,
            fromTokenID,
            contractAddress,
            tempImage,
            permanentImage,
            cid,
            computedRemovedTokenList
        } = await super.removeAssetsFromBundle(...props)

        const contract = new SmartContract({
            address: contractAddress,
            type: 'bundle'
        })

        const result = await contract.removeFromBundle(fromTokenID, computedRemovedTokenList, resultTokenCID)

        return {
            transactionHash: result.transactionHash,
            tempImage
        }
    }

    async unbundleToken(token){
        const contract = new SmartContract({
            address: token.contractAddress,
            type: 'bundle'
        })
        return await contract.unwrapToken(token.id)
    }



    /*  ----------  Connected methods OFF  ----------  */


    async deployOwnContract(){}



    /*  ----------  Getters ON  ----------  */

    async getUserTokens({updateCache = false} = {}){}

    async getUserEffects({updateCache = false} = {}) {}

    // async getTokenListByIdentity(identityList){}

    /*
    * Return token object by identity
    * @param identity: TokenIdentity
    * */
    // async getTokenByIdentity(identity){}

    /*
    * Get tokens which are inside bundle
    * @param tokenID: string
    * @return Array<TokenObject>
    * */
    // async getWrappedTokensObjectList(tokenID){}

    /*  ----------  Getters OFF  ----------  */



    /*  ----------  Actions ON  ----------  */

    async addUserContract(plainAddress, addWithoutTokensLoading = false) {}

    /*
    * Apply effect to token
    * @param {object} token - common token object like {id (Number), address (0x...), identity, name, image, ?attributes, ?external_url}
    * @param {object} effect - common token object
    * @param {object} meta - {name, description, link}
    * @return {object} like {transactionResult, provider}
    * */
    async applyEffectToToken({token, effect, meta}){}

    /*
    * Make tokens bundle
    * @param {array} tokens - array of common token objects like {id (Number), address (0x...), identity, name, image, ?attributes, ?external_url}
    * @param {object} meta - {name, description, link}
    * @param {object} ?image - instance of Blob (File)
    * @return {object} like {transactionResult, provider}
    * */
    async makeTokensBundle({tokens, meta, image = null}){}

    /*  Mass creating ON  */
    /*
    * @param contractAddress: String
    * @param tokenList: Array of token: {id, meta: {...}, image: Blob || string, imageTempURL: string, systemMeta: {state, transactionHash, errors, process, savedTokenDataCID}}
    * */
    // async* minTokensFromList(contractAddress, tokenList){
    minTokensFromListCover(contractAddress, tokenList){}

    /*
    * Try again to mint token
    * */
    async createMassTokenAgain(token){}

    async createTokensFromList(contractAddress, tokenList){}
    /*  Mass creating OFF  */

    async createNewToken({meta, image = null, contractAddress}){}

    async unwrap(tokenID) {}


    /*
    * Add tokens to bundle
    * @param addToTokenID:number - token id to what token new list of tokens mast be added
    * @param tokenList:Array<tokenIdentity> of token identities which must be added to bundle
    * */
    async addToBundle(addToTokenID, tokenList = []){}

    async removeFromBundle(fromTokenID, tokenList = []){}



    /*  -------- Effects white list ON --------  */

    // get or update effect contract list
    async getEffectContractList(){}

    /*
    * @param formObject: Object (see structure of object in SmartContract.js)
    * */
    async addContractToAllowEffectList(formObject){}

    async removeContractFromAllowEffectList(contractAddress){}

    /*  -------- Effects white list OFF --------  */
}

export default Rarible