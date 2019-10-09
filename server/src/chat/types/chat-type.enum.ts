export enum CHAT_TYPES {
  /**
   * 用户登录
   */
  loginUser = 'LOGIN_USER',
  /**
   * 服务器推送用户上线通知
   */
  onlineNotice = 'ONLINE_NOTICE',
  /**
   * 服务器推送用户下线通知
   */
  offlineNotice = 'OFFLINE_NOTICE',
  /**
   * 打开私聊窗口
   */
  openPersonalWindow = 'OPEN_PERSONAL_WINDOW',
  /**
   * 私聊窗口初始化数据
   */
  initPersonalLog = 'INIT_PERSONAL_LOG',
  /**
   * 客户端发送数据到服务器 --- 私聊
   */
  personalMsgToServer = 'PERSONAL_TO_SERVER',
  /**
   * 服务器推送消息到客户端 --- 私聊
   */
  personalMsgToClient = 'PERSONAL_MSG_TO_CLIENT',
}
