import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const adapter = new PrismaBetterSqlite3({ url: url.replace('file:', '') })
const prisma = new PrismaClient({ adapter })

const DATA = [
  { co: 'Deus Technologies', region: 'US', products: [
    { name: 'RapidScreen RS-2000', fda: 'P000041', year: 2001, ce: false, era: 1 }]},
  { co: 'R2 Technology', region: 'US', products: [
    { name: 'ImageChecker-CT Workstation', fda: 'K023003', year: 2002, ce: false, era: 1 },
    { name: 'ImageChecker-CT Software', fda: 'K041380', year: 2004, ce: false, era: 1 }]},
  { co: 'Siemens / Siemens Healthineers', region: 'EU', products: [
    { name: 'LungCare CT Software Package', fda: 'K033374', year: 2003, ce: true, era: 1 },
    { name: 'syngo Application Software', fda: 'K170747', year: 2017, ce: true, era: 3 },
    { name: 'AI-Rad Companion Engine', fda: 'K183272', year: 2019, ce: true, era: 3 },
    { name: 'AI-Rad Companion Pulmonary', fda: 'K183271', year: 2019, ce: true, era: 3 },
    { name: 'AI-Rad Companion Chest CT', fda: null, year: null, ce: true, era: 3 },
    { name: 'AI-Rad Companion Engine v2', fda: 'K193294', year: 2020, ce: true, era: 3 },
    { name: 'syngo.CT Lung CAD', fda: 'K193216', year: 2020, ce: true, era: 3 },
    { name: 'syngo.CT Lung CAD VD30', fda: 'K231157', year: 2023, ce: true, era: 3 },
    { name: 'Syngo Carbon Clinicals', fda: 'K251059', year: 2025, ce: true, era: 4 }]},
  { co: 'GE Medical Systems / GE Healthcare', region: 'US', products: [
    { name: 'Advanced Lung Analysis II / Lung VCAR', fda: 'K042694', year: 2004, ce: false, era: 1 },
    { name: 'Thoracic VCAR', fda: 'K103480', year: 2011, ce: false, era: 2 }]},
  { co: 'Median Technologies', region: 'FR', products: [
    { name: 'LMS-LUNG/TRACK', fda: 'K070868', year: 2007, ce: true, era: 1 },
    { name: 'eyonis LCS 1.0', fda: 'K251474', year: 2026, ce: true, era: 4 }]},
  { co: 'Toshiba Medical Systems', region: 'JP', products: [
    { name: 'Lung Volume Analysis', fda: 'K113715', year: 2012, ce: false, era: 2 }]},
  { co: 'RadLogics', region: 'US', products: [
    { name: 'AlphaPoint Imaging Software', fda: 'K120161', year: 2012, ce: false, era: 2 }]},
  { co: 'IMBIO LLC', region: 'US', products: [
    { name: 'Lung Density Analysis', fda: 'K141069', year: 2014, ce: false, era: 2 }]},
  { co: 'Riverain Technologies', region: 'US', products: [
    { name: 'ClearRead CT', fda: 'K161201', year: 2016, ce: true, era: 2 },
    { name: 'ClearRead CT – Compare', fda: null, year: null, ce: true, era: 2 },
    { name: 'ClearRead CT – Detect', fda: null, year: null, ce: true, era: 2 },
    { name: 'ClearRead CT – Vessel Suppress', fda: null, year: null, ce: true, era: 2 },
    { name: 'ClearRead CT CAC', fda: 'K242188', year: 2024, ce: true, era: 4 }]},
  { co: 'Body Vision Medical / BodyVision Medical', region: 'IL', products: [
    { name: 'Lung Vision', fda: 'K163622', year: 2017, ce: false, era: 3 },
    { name: 'LungVision', fda: 'K240943', year: 2024, ce: false, era: 3 }]},
  { co: 'Philips Medical Systems / Healthcare', region: 'EU', products: [
    { name: 'Illumeo System', fda: 'K173588', year: 2018, ce: true, era: 3 },
    { name: 'QLAB Advanced Quantification', fda: 'K191647', year: 2019, ce: true, era: 3 }]},
  { co: 'Arterys', region: 'US', products: [
    { name: 'Arterys Oncology DL', fda: 'K173542', year: 2018, ce: false, era: 3 },
    { name: 'Arterys MICA', fda: 'K182034', year: 2018, ce: false, era: 3 }]},
  { co: 'Thirona', region: 'EU', products: [
    { name: 'LungQ Software', fda: 'K173821', year: 2018, ce: true, era: 3 },
    { name: 'LungQ v3.0.0', fda: 'K232412', year: 2024, ce: true, era: 3 },
    { name: 'LungQ 4', fda: 'K250766', year: 2025, ce: true, era: 4 },
    { name: 'LungQ Clinical Suite', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Coreline Soft', region: 'KR', products: [
    { name: 'AVIEW', fda: 'K200714', year: 2020, ce: true, era: 3 },
    { name: 'AVIEW LCS', fda: 'K193220', year: 2020, ce: true, era: 3 },
    { name: 'A View LCS', fda: 'K201710', year: 2020, ce: false, era: 3 },
    { name: 'AVIEW LCS+', fda: null, year: null, ce: true, era: 3 },
    { name: 'AVIEW Lung Nodule CAD', fda: 'K221592', year: 2023, ce: true, era: 3 },
    { name: 'Med-LungCT AI', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Merge Healthcare', region: 'US', products: [
    { name: 'Merge PACS', fda: 'K192455', year: 2019, ce: false, era: 3 }]},
  { co: 'Optellum', region: 'EU', products: [
    { name: 'Optellum Virtual Nodule Clinic', fda: 'K202300', year: 2021, ce: true, era: 3 },
    { name: 'Virtual Nodule Clinic', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Change Healthcare', region: 'US', products: [
    { name: 'Change Healthcare Anatomical AI', fda: 'K210719', year: 2021, ce: false, era: 3 }]},
  { co: 'Fujifilm', region: 'JP', products: [
    { name: 'Synapse 3D Base Tools v6.1', fda: 'K203103', year: 2021, ce: true, era: 3 },
    { name: 'Synapse PACS 7.5', fda: 'K243647', year: 2025, ce: false, era: 4 }]},
  { co: 'Imagen Technologies', region: 'US', products: [
    { name: 'Lung-CAD', fda: 'K223811', year: 2023, ce: false, era: 3 }]},
  { co: 'MEDICALIP', region: 'KR', products: [
    { name: 'DeepCatch', fda: 'K223556', year: 2023, ce: false, era: 3 }]},
  { co: 'Qure.ai', region: 'CN', products: [
    { name: 'qXR-LN', fda: 'K231805', year: 2023, ce: true, era: 3 },
    { name: 'qCT LN Quant', fda: 'K240740', year: 2024, ce: true, era: 3 },
    { name: 'qCT-Lung', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Infervision', region: 'CN', products: [
    { name: 'InferRead CT Lung', fda: null, year: null, ce: true, era: 3 },
    { name: 'InferRead Lung CT.AI', fda: 'K240554', year: 2024, ce: true, era: 3 }]},
  { co: 'Arineta', region: 'IL', products: [
    { name: 'SpotLight / SpotLight Duo', fda: 'K241200', year: 2025, ce: false, era: 4 }]},
  { co: 'V5med', region: 'US', products: [
    { name: 'V5med Lung AI', fda: 'K242919', year: 2025, ce: false, era: 4 }]},
  { co: 'Exo Inc', region: 'US', products: [
    { name: 'Lung AI (LAI001)', fda: 'K243239', year: 2025, ce: false, era: 4 }]},
  { co: 'AZmed', region: 'FR', products: [
    { name: 'AZnod', fda: null, year: null, ce: true, era: 3 },
    { name: 'Rayvolve LN', fda: 'K243831', year: 2025, ce: true, era: 4 }]},
  { co: 'United Imaging Intelligence', region: 'CN', products: [
    { name: 'CT Pulmonary Nodules 3D Analysis', fda: null, year: null, ce: true, era: 3 },
    { name: 'uAI-Discover Chest CT', fda: null, year: null, ce: true, era: 4 }]},
  { co: 'contextflow', region: 'EU', products: [
    { name: 'contextflow ADVANCE Chest CT', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'HY Medical', region: 'CN', products: [
    { name: 'CT AI Lung Nodule Detection', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Oxipit', region: 'EU', products: [
    { name: 'CT Eye', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'IMedis', region: 'EU', products: [
    { name: 'Duali-Q', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Harrison.ai', region: 'AU', products: [
    { name: 'Harrison CT Chest', fda: null, year: null, ce: true, era: 4 }]},
  { co: 'JLK Inc.', region: 'KR', products: [
    { name: 'JLD-01K', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Monitor Corporation', region: 'JP', products: [
    { name: 'LuCAS-Plus', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'DeepHealth', region: 'EU', products: [
    { name: 'Lung Check (Veye Lung Nodules)', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Rayscape', region: 'EU', products: [
    { name: 'Lung CT', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'GLEAMER', region: 'FR', products: [
    { name: 'LungCT', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'RevealDx', region: 'US', products: [
    { name: 'RevealAI-Lung', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'SenseTime', region: 'CN', products: [
    { name: 'SenseCare-Lung Pro', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Milvue', region: 'FR', products: [
    { name: 'TechCare Chest', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'Mitsubishi Space Software', region: 'JP', products: [
    { name: 'Truedia', fda: null, year: null, ce: true, era: 3 }]},
  { co: 'MeVis Medical Solutions', region: 'EU', products: [
    { name: 'Veolity', fda: null, year: null, ce: true, era: 3 }]},
]

async function main() {
  console.log('Seeding database...')
  await prisma.product.deleteMany()
  await prisma.company.deleteMany()

  for (const item of DATA) {
    await prisma.company.create({
      data: {
        name: item.co,
        region: item.region,
        products: {
          create: item.products.map(p => ({
            name: p.name,
            fdaNumber: p.fda ?? null,
            year: p.year ?? null,
            ce: p.ce,
            era: p.era,
          })),
        },
      },
    })
  }

  const companies = await prisma.company.count()
  const products = await prisma.product.count()
  console.log(`Seeded ${companies} companies, ${products} products.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
