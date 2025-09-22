import { ExtendedApplicationContext } from '../../interfaces/application-context.interface';
export interface HippoUser {
    id: string;
    brand: string;
    email: string;
    name: string;
    permissions: {
        admin: boolean;
        createContent: boolean;
        editCode: boolean;
        editDesigns: boolean;
    };
    hippoApi: {
        user: string;
        password: string;
        url: string;
    };
}
declare class UserManagementService {
    static getUserDetails(context: ExtendedApplicationContext): HippoUser;
}
export default UserManagementService;
