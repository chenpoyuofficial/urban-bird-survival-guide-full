import 'dotenv/config'
import prisma from '../lib/prisma.js'

const BOARD_NAMES = ['育雛資訊', '生存指南', '日常分享', '覓食情報']

async function main() {
  for (const name of BOARD_NAMES) {
    await prisma.board.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log('Boards seeded:', BOARD_NAMES.join('、'))
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
