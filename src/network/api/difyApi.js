import { chatNetworkStream } from '@/network/difyRequest';

// 智能问答助手API
/* @param {string} query            - 页面层传入的用户提问文本
 * @param {string} conversationId   - 页面层传入的会话 ID
 * @param {Function} onChunk        - 🔴 业务接口调用者（页面层）直接提供的拼字回调函数
 * @returns {Promise<Object>}       - 🔴 直接返回网络层的函数调用（转发 Promise）
 */
const chatServiceStream = (query, conversationId, onChunk) => {
  return chatNetworkStream(query, conversationId, onChunk);
  
};
export default { chatServiceStream }
