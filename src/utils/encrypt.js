import cryptoJs from 'crypto-js'

export const encryptFile = async (file) => {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      const bytes = fileReader.result
      const encrypted = cryptoJs.AES.encrypt(bytes, 'secret key 123').toString()
      resolve(encrypted)
    }
    fileReader.onerror = (error) => {
      console.log(error)
      reject(error)
    }
  })
}

export const decryptFile = (stringToDecryptAsFile) => {
  const decrypted = cryptoJs.AES.decrypt(stringToDecryptAsFile, 'secret key 123').toString(cryptoJs.enc.Utf8)
  return decrypted
}
