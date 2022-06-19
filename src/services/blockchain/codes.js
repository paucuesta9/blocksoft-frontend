
import axios from 'axios'
import { BigNumber } from 'ethers'
import getEthereumContract from '../../utils/getEthereumContract'

export const getAllCodes = () => {
  const contract = getEthereumContract()
  return contract.fetchCodes()
}

export const getUserOwnerCodes = (userAddress) => {
  const contract = getEthereumContract()
  return contract.fetchUserOwnerCodes(userAddress)
}

export const getCodesCreatedByUser = (userAddress) => {
  const contract = getEthereumContract()
  return contract.fetchCodesCreatedByUser(userAddress)
}

export const getFavoritesCodes = (tokens) => {
  const contract = getEthereumContract()
  return contract.fetchCodesByToken(tokens)
}

export const getCode = async (tokenId) => {
  const contract = getEthereumContract()
  return contract.fetchCode(tokenId)
}

export const createNFT = async (number, metadata, privated) => {
  const contract = getEthereumContract()
  const txs = []
  for (let i = 0; i < number; i++) {
    const tx = await contract.createCode(metadata, privated)
    txs.push(await tx.wait())
  }
  return txs
}

export const getUriURL = (tokenId) => {
  const contract = getEthereumContract()
  return contract.tokenURI(tokenId)
}

export const getUri = (uri) => {
  return axios.get(uri)
}

export const getHistoryTransactions = (tokenId) => {
  const contract = getEthereumContract()
  const filters = contract.filters.Transfer(null, null, BigNumber.from(tokenId))
  return contract.queryFilter(filters)
}

export const transfer = (tokenId, to) => {
  const contract = getEthereumContract()
  return contract.transferCode(tokenId, to)
}
