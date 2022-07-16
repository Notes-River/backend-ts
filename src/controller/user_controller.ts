import { Router, IRouter } from 'express';
import { headersToken, loginBody, passwordChange, regBody } from '../utils/body_control';
import { checkRequiredBody } from '../middleware/check_required_body';
import { checkRequiredHeaders } from '../middleware/check_required_headers';
import { changePassword, checkUsername, loginUser, logoutUser, registerUser, requestAccountVerification, userProfile, verifyUserAccount } from '../service/user_service';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { checkUserNotVerified } from '../utils/features';

export const userApi: IRouter = Router();

userApi.post('/register-user',
    checkRequiredBody(regBody),
    registerUser,
);

userApi.post('/login-user',
    checkRequiredBody(loginBody),
    loginUser,
);

userApi.get('/user-profile',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    userProfile,
);

userApi.post('/request-ac-verification',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    checkUserNotVerified(),
    requestAccountVerification,
);

userApi.post('/verify-email/:code',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    checkUserNotVerified(),
    verifyUserAccount,
)


userApi.delete('/logout-user',
    checkRequiredHeaders(headersToken),
    isAuthenticated,
    logoutUser,
)


userApi.get('/check-username/:username',
    checkUsername,
)

userApi.patch('/change-password',
    checkRequiredHeaders(headersToken),
    checkRequiredBody(passwordChange),
    isAuthenticated,
    changePassword,
);

//TODO:..............
userApi.patch('/update-user',
    checkRequiredHeaders(headersToken),
)