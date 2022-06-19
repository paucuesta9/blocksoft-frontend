import { ethers } from 'ethers'
import { contractABI, contractAddress } from './constants'

const { ethereum } = window

const getEthereumContract = () => {
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    try {
      signer.getAddress()
      return new ethers.Contract(contractAddress, contractABI, signer)
    } catch (error) {
      return new ethers.Contract(contractAddress, contractABI, provider)
    }
  } else {
    const provider = new ethers.providers.InfuraProvider('rinkeby', import.meta.env.INFURA_KEY)
    return new ethers.Contract(contractAddress, contractABI, provider)
  }
}

export default getEthereumContract
