import { chatNetworkStream, interactMagicPot, analyzeStall } from '@/network/difyRequest';

// 智能问答助手API
/* @param {string} query            - 页面层传入的用户提问文本
 * @param {string} conversationId   - 页面层传入的会话 ID
 * @param {Function} onChunk        - 🔴 业务接口调用者（页面层）直接提供的拼字回调函数
 * @returns {Promise<Object>}       - 🔴 直接返回网络层的函数调用（转发 Promise）
 */
const chatServiceStream = (query, conversationId, onChunk) => {
  return chatNetworkStream(query, conversationId, onChunk);
};

// 🔮 智能评论生成多轮交互API (魔法小锅)
/* @param {Object} messages         - 本轮发送的业务对象 (第1轮为 { dishID, dishName }，后续轮为 { answer })
 * @param {string} conversationID   - 会话 ID (首轮对话传空字符串 "")
 * @returns {Promise<Object>}       - 返回包含 { conversationID, data } 的清洗及反序列化后的纯 JS 业务数据对象
 */
const magicPotInteractService = (messages, conversationID = '') => {
  return interactMagicPot(messages, conversationID);
};

// 食堂探长档口评析API
/* @param {Object} stallInfo        - 当前档口对象 { stallID, stallName, canteenName }
 * @param {Object} inputs           - Dify 应用必填输入变量 { stall_name, rating, comments_json }
 * @returns {Promise<Object>}       - 返回包含 { conversationID, data } 的清洗及反序列化后的纯 JS 分析结果
 */
const stallAnalysisService = (stallInfo, inputs = {}) => {
  return analyzeStall(stallInfo, inputs);
};





export default { 
  chatServiceStream,
  magicPotInteractService,
  stallAnalysisService
}
