import { Request } from 'express';
import User from '../users/user.entity';
/**
 * Thanks to doing all of the above, our /log-in route is handled by Passport. 
 * The data of the user is attached to the request object, and this is why we extend the Request interface.
 */
interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;

