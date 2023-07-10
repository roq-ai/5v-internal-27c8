import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { candidateValidationSchema } from 'validationSchema/candidates';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.candidate
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCandidateById();
    case 'PUT':
      return updateCandidateById();
    case 'DELETE':
      return deleteCandidateById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCandidateById() {
    const data = await prisma.candidate.findFirst(convertQueryToPrismaUtil(req.query, 'candidate'));
    return res.status(200).json(data);
  }

  async function updateCandidateById() {
    await candidateValidationSchema.validate(req.body);
    const data = await prisma.candidate.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCandidateById() {
    const data = await prisma.candidate.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
