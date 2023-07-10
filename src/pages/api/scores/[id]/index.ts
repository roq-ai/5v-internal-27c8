import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { scoreValidationSchema } from 'validationSchema/scores';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.score
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getScoreById();
    case 'PUT':
      return updateScoreById();
    case 'DELETE':
      return deleteScoreById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getScoreById() {
    const data = await prisma.score.findFirst(convertQueryToPrismaUtil(req.query, 'score'));
    return res.status(200).json(data);
  }

  async function updateScoreById() {
    await scoreValidationSchema.validate(req.body);
    const data = await prisma.score.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteScoreById() {
    const data = await prisma.score.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
