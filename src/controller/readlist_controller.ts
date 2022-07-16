import { Request, Response, Router, IRouter } from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { checkRequiredHeaders } from '../middleware/check_required_headers';
import { headersToken, notRequiredBodyForReadlist } from '../utils/body_control';
import { checkUserVerified } from '../utils/features';
import { checkNotRequiredBody, checkRequiredBody } from '../middleware/check_required_body';
import { createReadlist, deleteReadlist, fetchReadlist, fetchReadlistByuserId } from '../service/readlist_service';

export const readlistApi: IRouter = Router();

readlistApi.post('/create',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    checkUserVerified(),
    checkRequiredBody(['title']),
    checkNotRequiredBody(notRequiredBodyForReadlist),
    createReadlist,
)

readlistApi.get('/auth/user',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    fetchReadlist,
)

readlistApi.get('/user/:id',
    fetchReadlistByuserId
)

readlistApi.get('')

readlistApi.delete('/delete/:id',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    checkUserVerified(),
    deleteReadlist,
)