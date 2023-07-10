import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { jobValidationSchema } from 'validationSchema/jobs';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getJobs();
    case 'POST':
      return createJob();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJobs() {
    const data = await prisma.job
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'job'));
    return res.status(200).json(data);
  }

  async function createJob() {
    await jobValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.candidate?.length > 0) {
      const create_candidate = body.candidate;
      body.candidate = {
        create: create_candidate,
      };
    } else {
      delete body.candidate;
    }
    const data = await prisma.job.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
