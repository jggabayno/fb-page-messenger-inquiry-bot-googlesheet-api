import { GoogleSpreadsheet } from 'google-spreadsheet'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const creds =  require('../client_secret.json')

const doc = new GoogleSpreadsheet('17YR2qtFctWUCg8ms3B6WcT2nPDGQVivQIkdJsqX_RZg')

export default async function useSpreedSheet() {
    await doc.useServiceAccountAuth({client_email: creds.client_email, private_key: creds.private_key})
    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[0];
    const rows =  await sheet.getRows(
        // {query: 'name = jonh'}
    )
    
    return { sheet, rows }
}