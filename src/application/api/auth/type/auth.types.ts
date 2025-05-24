import { UserRole } from '@core/common/enums/UserEnums';
import { Request } from 'express';

export type HttpUserPayload = {
  id: string;
  email: string;
  role: UserRole;
};

export type HttpRequestWithUser = Request & {
  user: HttpJwtPayload;
};

export type HttpJwtPayload = {
  id: string;
  role: UserRole;
  email: string;
};

export type HttpLoggedInUser = {
  id: string;
  accessToken: string;
};
