import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as { companyId: string };
    return user.companyId;
  },
);
