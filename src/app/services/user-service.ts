import { WsMessage } from '../enums/ws-message';
import { IAllUsers, IUser, IUserPayloadResp, Responses } from '../interfaces/socket-response';
import { setStatusFunc } from '../utilities/status';
import { Observable } from '../utilities/observable';
import { socketService } from './websocket-service';

class UserService {
  private usersList = new Observable<IUser[]>([]);

  private isLogined = new Observable<string>('false');

  private userData = new Observable<[name: string, status: string]>(['', '']);

  constructor() {
    socketService.subscribeListener(WsMessage.USER_ACTIVE, this.loadUsers);
    socketService.subscribeListener(WsMessage.USER_INACTIVE, this.loadUsers);
    socketService.subscribeListener(WsMessage.USER_EXTERNAL_LOGIN, this.loadExternalUsers);
    socketService.subscribeListener(WsMessage.USER_EXTERNAL_LOGOUT, this.loadExternalUsers);
  }

  public authenticateUser(name: string, password: string) {
    this.isLogined.notify('true');
    sessionStorage.setItem('Name', `${name}`);
    sessionStorage.setItem('Password', `${password}`);
    socketService.authenticateUser(name, password);
  }

  loadUsers = (data: Responses) => {
    const response = data as IAllUsers;
    if (response.users.length !== 0) {
      response.users.forEach((el: IUser) => {
        if (!this.usersList.getValue().includes(el)) {
          this.usersList.notify((prev) => [...prev, el]);
        }
      });
    }
  };

  loadExternalUsers = (data: Responses) => {
    const response = data as IUserPayloadResp;
    const externalUser = response.user as IUser;
    const list = this.usersList.getValue();
    this.usersList.notify([]);
    list.forEach((el, i) => {
      if (el.login === externalUser.login && el.isLogined !== externalUser.isLogined) {
        list.splice(i, 1);
      }
      if (el.login === externalUser.login && el.isLogined === externalUser.isLogined) {
        list.splice(i, 1);
      }
    });
    if (sessionStorage.getItem('loginDialogue') === externalUser.login) {
      const status = setStatusFunc(externalUser.isLogined);
      sessionStorage.setItem('statusDialogue', status);
      this.userData.notify([externalUser.login, status]);
    }
    this.usersList.notify([...list, externalUser]);
  };

  public getUsersList() {
    return this.usersList;
  }

  public getUserStatus() {
    return this.isLogined;
  }

  public getUserData() {
    return this.userData;
  }

  userFilter(name: string) {
    if (name === '') {
      return this.usersList.getValue();
    }
    return this.usersList.getValue().filter((user) => {
      return user.login === name;
    });
  }
}

export const userService = new UserService();
